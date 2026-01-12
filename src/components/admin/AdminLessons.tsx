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

interface LessonForm {
  scenario_id: string;
  order_index: number;
  duration_minutes: number;
  xp_reward: number;
  translations: {
    language: UILanguage;
    title: string;
    content: string;
  }[];
}

const LANGUAGES: UILanguage[] = ['en', 'ar', 'tr', 'uk'];
const LANGUAGE_NAMES: Record<UILanguage, string> = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  uk: 'Українська'
};

export function AdminLessons() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>({
    scenario_id: '',
    order_index: 0,
    duration_minutes: 5,
    xp_reward: 10,
    translations: LANGUAGES.map(lang => ({ language: lang, title: '', content: '' }))
  });

  const { data: scenarios } = useQuery({
    queryKey: ['admin-scenarios-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('id, icon, level, scenario_translations(name, language)')
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['admin-lessons'],
    queryFn: async () => {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*, scenarios(icon, level)')
        .order('order_index');
      
      if (lessonsError) throw lessonsError;

      const { data: translationsData, error: translationsError } = await supabase
        .from('lesson_translations')
        .select('*');
      
      if (translationsError) throw translationsError;

      return lessonsData.map(lesson => ({
        ...lesson,
        translations: translationsData.filter(t => t.lesson_id === lesson.id)
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: LessonForm) => {
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          scenario_id: data.scenario_id,
          order_index: data.order_index,
          duration_minutes: data.duration_minutes,
          xp_reward: data.xp_reward
        })
        .select()
        .single();
      
      if (lessonError) throw lessonError;

      const translations = data.translations
        .filter(t => t.title.trim())
        .map(t => ({
          lesson_id: lesson.id,
          language: t.language,
          title: t.title,
          content: t.content
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('lesson_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }

      return lesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      toast.success('تم إضافة الدرس بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LessonForm }) => {
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({
          scenario_id: data.scenario_id,
          order_index: data.order_index,
          duration_minutes: data.duration_minutes,
          xp_reward: data.xp_reward
        })
        .eq('id', id);
      
      if (lessonError) throw lessonError;

      await supabase
        .from('lesson_translations')
        .delete()
        .eq('lesson_id', id);

      const translations = data.translations
        .filter(t => t.title.trim())
        .map(t => ({
          lesson_id: id,
          language: t.language,
          title: t.title,
          content: t.content
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('lesson_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      toast.success('تم تحديث الدرس بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons'] });
      toast.success('تم حذف الدرس بنجاح');
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const resetForm = () => {
    setForm({
      scenario_id: '',
      order_index: 0,
      duration_minutes: 5,
      xp_reward: 10,
      translations: LANGUAGES.map(lang => ({ language: lang, title: '', content: '' }))
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lesson: any) => {
    setEditingId(lesson.id);
    setForm({
      scenario_id: lesson.scenario_id,
      order_index: lesson.order_index,
      duration_minutes: lesson.duration_minutes,
      xp_reward: lesson.xp_reward,
      translations: LANGUAGES.map(lang => {
        const existing = lesson.translations.find((t: any) => t.language === lang);
        return {
          language: lang,
          title: existing?.title || '',
          content: existing?.content || ''
        };
      })
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.scenario_id) {
      toast.error('يرجى اختيار السيناريو');
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const updateTranslation = (lang: UILanguage, field: 'title' | 'content', value: string) => {
    setForm(prev => ({
      ...prev,
      translations: prev.translations.map(t => 
        t.language === lang ? { ...t, [field]: value } : t
      )
    }));
  };

  const getScenarioName = (scenarioId: string) => {
    const scenario = scenarios?.find(s => s.id === scenarioId);
    if (!scenario) return 'غير معروف';
    const translation = scenario.scenario_translations?.find((t: any) => t.language === 'ar') ||
                       scenario.scenario_translations?.find((t: any) => t.language === 'en');
    return `${scenario.icon} ${translation?.name || 'بدون اسم'} (${scenario.level})`;
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
        <CardTitle>الدروس</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة درس
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل الدرس' : 'إضافة درس جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>السيناريو</Label>
                <Select value={form.scenario_id} onValueChange={v => setForm(prev => ({ ...prev, scenario_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السيناريو" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios?.map(scenario => {
                      const translation = scenario.scenario_translations?.find((t: any) => t.language === 'ar') ||
                                         scenario.scenario_translations?.find((t: any) => t.language === 'en');
                      return (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.icon} {translation?.name || 'بدون اسم'} ({scenario.level})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input 
                    type="number"
                    value={form.order_index} 
                    onChange={e => setForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>المدة (دقائق)</Label>
                  <Input 
                    type="number"
                    value={form.duration_minutes} 
                    onChange={e => setForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 5 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نقاط XP</Label>
                  <Input 
                    type="number"
                    value={form.xp_reward} 
                    onChange={e => setForm(prev => ({ ...prev, xp_reward: parseInt(e.target.value) || 10 }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">الترجمات</h3>
                {LANGUAGES.map(lang => (
                  <div key={lang} className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium">{LANGUAGE_NAMES[lang]}</h4>
                    <div className="space-y-2">
                      <Label>العنوان</Label>
                      <Input 
                        value={form.translations.find(t => t.language === lang)?.title || ''}
                        onChange={e => updateTranslation(lang, 'title', e.target.value)}
                        placeholder={`العنوان بـ ${LANGUAGE_NAMES[lang]}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>المحتوى</Label>
                      <Textarea 
                        value={form.translations.find(t => t.language === lang)?.content || ''}
                        onChange={e => updateTranslation(lang, 'content', e.target.value)}
                        placeholder={`المحتوى بـ ${LANGUAGE_NAMES[lang]}`}
                        rows={3}
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
              <TableHead>السيناريو</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الترتيب</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons?.map(lesson => (
              <TableRow key={lesson.id}>
                <TableCell>
                  {lesson.scenarios?.icon} {lesson.scenarios?.level}
                </TableCell>
                <TableCell>
                  {lesson.translations.find((t: any) => t.language === 'ar')?.title || 
                   lesson.translations.find((t: any) => t.language === 'en')?.title || 
                   'بدون عنوان'}
                </TableCell>
                <TableCell>{lesson.order_index}</TableCell>
                <TableCell>{lesson.duration_minutes} دقائق</TableCell>
                <TableCell>{lesson.xp_reward}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(lesson)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(lesson.id)}
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
