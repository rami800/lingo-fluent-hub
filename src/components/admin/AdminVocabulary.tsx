import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type UILanguage = Database['public']['Enums']['ui_language'];

interface VocabularyForm {
  lesson_id: string;
  german_word: string;
  article: string;
  plural: string;
  order_index: number;
  image_url: string;
  pronunciation_url: string;
  translations: {
    language: UILanguage;
    translation: string;
    example_sentence: string;
  }[];
}

const LANGUAGES: UILanguage[] = ['en', 'ar', 'tr', 'uk'];
const LANGUAGE_NAMES: Record<UILanguage, string> = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  uk: 'Українська'
};

export function AdminVocabulary() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VocabularyForm>({
    lesson_id: '',
    german_word: '',
    article: '',
    plural: '',
    order_index: 0,
    image_url: '',
    pronunciation_url: '',
    translations: LANGUAGES.map(lang => ({ language: lang, translation: '', example_sentence: '' }))
  });

  const { data: lessons } = useQuery({
    queryKey: ['admin-lessons-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, order_index, scenarios(icon, level), lesson_translations(title, language)')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: vocabulary, isLoading } = useQuery({
    queryKey: ['admin-vocabulary'],
    queryFn: async () => {
      const { data: vocabData, error: vocabError } = await supabase
        .from('vocabulary')
        .select('*, lessons(order_index, scenarios(icon, level))')
        .order('order_index');
      
      if (vocabError) throw vocabError;

      const { data: translationsData, error: translationsError } = await supabase
        .from('vocabulary_translations')
        .select('*');
      
      if (translationsError) throw translationsError;

      return vocabData.map(vocab => ({
        ...vocab,
        translations: translationsData.filter(t => t.vocabulary_id === vocab.id)
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: VocabularyForm) => {
      const { data: vocab, error: vocabError } = await supabase
        .from('vocabulary')
        .insert({
          lesson_id: data.lesson_id,
          german_word: data.german_word,
          article: data.article || null,
          plural: data.plural || null,
          order_index: data.order_index,
          image_url: data.image_url || null,
          pronunciation_url: data.pronunciation_url || null
        })
        .select()
        .single();
      
      if (vocabError) throw vocabError;

      const translations = data.translations
        .filter(t => t.translation.trim())
        .map(t => ({
          vocabulary_id: vocab.id,
          language: t.language,
          translation: t.translation,
          example_sentence: t.example_sentence || null
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('vocabulary_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }

      return vocab;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vocabulary'] });
      toast.success('تم إضافة المفردة بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VocabularyForm }) => {
      const { error: vocabError } = await supabase
        .from('vocabulary')
        .update({
          lesson_id: data.lesson_id,
          german_word: data.german_word,
          article: data.article || null,
          plural: data.plural || null,
          order_index: data.order_index,
          image_url: data.image_url || null,
          pronunciation_url: data.pronunciation_url || null
        })
        .eq('id', id);
      
      if (vocabError) throw vocabError;

      await supabase
        .from('vocabulary_translations')
        .delete()
        .eq('vocabulary_id', id);

      const translations = data.translations
        .filter(t => t.translation.trim())
        .map(t => ({
          vocabulary_id: id,
          language: t.language,
          translation: t.translation,
          example_sentence: t.example_sentence || null
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('vocabulary_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vocabulary'] });
      toast.success('تم تحديث المفردة بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vocabulary')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vocabulary'] });
      toast.success('تم حذف المفردة بنجاح');
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const resetForm = () => {
    setForm({
      lesson_id: '',
      german_word: '',
      article: '',
      plural: '',
      order_index: 0,
      image_url: '',
      pronunciation_url: '',
      translations: LANGUAGES.map(lang => ({ language: lang, translation: '', example_sentence: '' }))
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (vocab: any) => {
    setEditingId(vocab.id);
    setForm({
      lesson_id: vocab.lesson_id,
      german_word: vocab.german_word,
      article: vocab.article || '',
      plural: vocab.plural || '',
      order_index: vocab.order_index || 0,
      image_url: vocab.image_url || '',
      pronunciation_url: vocab.pronunciation_url || '',
      translations: LANGUAGES.map(lang => {
        const existing = vocab.translations.find((t: any) => t.language === lang);
        return {
          language: lang,
          translation: existing?.translation || '',
          example_sentence: existing?.example_sentence || ''
        };
      })
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lesson_id) {
      toast.error('يرجى اختيار الدرس');
      return;
    }
    if (!form.german_word.trim()) {
      toast.error('يرجى إدخال الكلمة الألمانية');
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const updateTranslation = (lang: UILanguage, field: 'translation' | 'example_sentence', value: string) => {
    setForm(prev => ({
      ...prev,
      translations: prev.translations.map(t => 
        t.language === lang ? { ...t, [field]: value } : t
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>المفردات</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة مفردة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل المفردة' : 'إضافة مفردة جديدة'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>الدرس</Label>
                <Select value={form.lesson_id} onValueChange={v => setForm(prev => ({ ...prev, lesson_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الدرس" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons?.map(lesson => {
                      const translation = lesson.lesson_translations?.find((t: any) => t.language === 'ar') ||
                                         lesson.lesson_translations?.find((t: any) => t.language === 'en');
                      return (
                        <SelectItem key={lesson.id} value={lesson.id}>
                          {lesson.scenarios?.icon} {translation?.title || 'بدون عنوان'} ({lesson.scenarios?.level})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الكلمة الألمانية *</Label>
                  <Input 
                    value={form.german_word} 
                    onChange={e => setForm(prev => ({ ...prev, german_word: e.target.value }))}
                    placeholder="مثال: Haus"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>أداة التعريف</Label>
                  <Select value={form.article} onValueChange={v => setForm(prev => ({ ...prev, article: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأداة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="der">der (مذكر)</SelectItem>
                      <SelectItem value="die">die (مؤنث)</SelectItem>
                      <SelectItem value="das">das (محايد)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>صيغة الجمع</Label>
                  <Input 
                    value={form.plural} 
                    onChange={e => setForm(prev => ({ ...prev, plural: e.target.value }))}
                    placeholder="مثال: Häuser"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input 
                    type="number"
                    value={form.order_index} 
                    onChange={e => setForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رابط الصورة</Label>
                  <Input 
                    value={form.image_url} 
                    onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط النطق</Label>
                  <Input 
                    value={form.pronunciation_url} 
                    onChange={e => setForm(prev => ({ ...prev, pronunciation_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">الترجمات</h3>
                {LANGUAGES.map(lang => (
                  <div key={lang} className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium">{LANGUAGE_NAMES[lang]}</h4>
                    <div className="space-y-2">
                      <Label>الترجمة</Label>
                      <Input 
                        value={form.translations.find(t => t.language === lang)?.translation || ''}
                        onChange={e => updateTranslation(lang, 'translation', e.target.value)}
                        placeholder={`الترجمة بـ ${LANGUAGE_NAMES[lang]}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>جملة مثال</Label>
                      <Textarea 
                        value={form.translations.find(t => t.language === lang)?.example_sentence || ''}
                        onChange={e => updateTranslation(lang, 'example_sentence', e.target.value)}
                        placeholder={`جملة مثال بـ ${LANGUAGE_NAMES[lang]}`}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>إلغاء</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  )}
                  {editingId ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكلمة</TableHead>
              <TableHead>الأداة</TableHead>
              <TableHead>الترجمة (عربي)</TableHead>
              <TableHead>الدرس</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vocabulary?.map(vocab => (
              <TableRow key={vocab.id}>
                <TableCell className="font-medium">{vocab.german_word}</TableCell>
                <TableCell>{vocab.article || '-'}</TableCell>
                <TableCell>
                  {vocab.translations.find((t: any) => t.language === 'ar')?.translation || 
                   vocab.translations.find((t: any) => t.language === 'en')?.translation || 
                   '-'}
                </TableCell>
                <TableCell>
                  {vocab.lessons?.scenarios?.icon} {vocab.lessons?.scenarios?.level}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(vocab)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(vocab.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
