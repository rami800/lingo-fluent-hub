import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type GermanLevel = Database['public']['Enums']['german_level'];
type UILanguage = Database['public']['Enums']['ui_language'];

interface ScenarioForm {
  icon: string;
  level: GermanLevel;
  is_free: boolean;
  order_index: number;
  translations: {
    language: UILanguage;
    name: string;
    description: string;
  }[];
}

const LEVELS: GermanLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LANGUAGES: UILanguage[] = ['en', 'ar', 'tr', 'uk'];
const LANGUAGE_NAMES: Record<UILanguage, string> = {
  en: 'English',
  ar: 'العربية',
  tr: 'Türkçe',
  uk: 'Українська'
};

export function AdminScenarios() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ScenarioForm>({
    icon: '📚',
    level: 'A1',
    is_free: true,
    order_index: 0,
    translations: LANGUAGES.map(lang => ({ language: lang, name: '', description: '' }))
  });

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['admin-scenarios'],
    queryFn: async () => {
      const { data: scenariosData, error: scenariosError } = await supabase
        .from('scenarios')
        .select('*')
        .order('order_index');
      
      if (scenariosError) throw scenariosError;

      const { data: translationsData, error: translationsError } = await supabase
        .from('scenario_translations')
        .select('*');
      
      if (translationsError) throw translationsError;

      return scenariosData.map(scenario => ({
        ...scenario,
        translations: translationsData.filter(t => t.scenario_id === scenario.id)
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ScenarioForm) => {
      const { data: scenario, error: scenarioError } = await supabase
        .from('scenarios')
        .insert({
          icon: data.icon,
          level: data.level,
          is_free: data.is_free,
          order_index: data.order_index
        })
        .select()
        .single();
      
      if (scenarioError) throw scenarioError;

      const translations = data.translations
        .filter(t => t.name.trim())
        .map(t => ({
          scenario_id: scenario.id,
          language: t.language,
          name: t.name,
          description: t.description
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('scenario_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }

      return scenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('تم إضافة السيناريو بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ScenarioForm }) => {
      const { error: scenarioError } = await supabase
        .from('scenarios')
        .update({
          icon: data.icon,
          level: data.level,
          is_free: data.is_free,
          order_index: data.order_index
        })
        .eq('id', id);
      
      if (scenarioError) throw scenarioError;

      // Delete existing translations and insert new ones
      await supabase
        .from('scenario_translations')
        .delete()
        .eq('scenario_id', id);

      const translations = data.translations
        .filter(t => t.name.trim())
        .map(t => ({
          scenario_id: id,
          language: t.language,
          name: t.name,
          description: t.description
        }));

      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('scenario_translations')
          .insert(translations);
        
        if (translationError) throw translationError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('تم تحديث السيناريو بنجاح');
      resetForm();
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scenarios'] });
      toast.success('تم حذف السيناريو بنجاح');
    },
    onError: (error) => {
      toast.error('حدث خطأ: ' + error.message);
    }
  });

  const resetForm = () => {
    setForm({
      icon: '📚',
      level: 'A1',
      is_free: true,
      order_index: 0,
      translations: LANGUAGES.map(lang => ({ language: lang, name: '', description: '' }))
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (scenario: any) => {
    setEditingId(scenario.id);
    setForm({
      icon: scenario.icon,
      level: scenario.level,
      is_free: scenario.is_free,
      order_index: scenario.order_index,
      translations: LANGUAGES.map(lang => {
        const existing = scenario.translations.find((t: any) => t.language === lang);
        return {
          language: lang,
          name: existing?.name || '',
          description: existing?.description || ''
        };
      })
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const updateTranslation = (lang: UILanguage, field: 'name' | 'description', value: string) => {
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
        <CardTitle>السيناريوهات</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة سيناريو
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل السيناريو' : 'إضافة سيناريو جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Input 
                    value={form.icon} 
                    onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="📚"
                  />
                </div>
                <div className="space-y-2">
                  <Label>المستوى</Label>
                  <Select value={form.level} onValueChange={(v: GermanLevel) => setForm(prev => ({ ...prev, level: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input 
                    type="number"
                    value={form.order_index} 
                    onChange={e => setForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={form.is_free} 
                    onCheckedChange={v => setForm(prev => ({ ...prev, is_free: v }))}
                  />
                  <Label>مجاني</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">الترجمات</h3>
                {LANGUAGES.map(lang => (
                  <div key={lang} className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium">{LANGUAGE_NAMES[lang]}</h4>
                    <div className="space-y-2">
                      <Label>الاسم</Label>
                      <Input 
                        value={form.translations.find(t => t.language === lang)?.name || ''}
                        onChange={e => updateTranslation(lang, 'name', e.target.value)}
                        placeholder={`الاسم بـ ${LANGUAGE_NAMES[lang]}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الوصف</Label>
                      <Textarea 
                        value={form.translations.find(t => t.language === lang)?.description || ''}
                        onChange={e => updateTranslation(lang, 'description', e.target.value)}
                        placeholder={`الوصف بـ ${LANGUAGE_NAMES[lang]}`}
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
              <TableHead>الأيقونة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>المستوى</TableHead>
              <TableHead>الترتيب</TableHead>
              <TableHead>مجاني</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios?.map(scenario => (
              <TableRow key={scenario.id}>
                <TableCell className="text-2xl">{scenario.icon}</TableCell>
                <TableCell>
                  {scenario.translations.find((t: any) => t.language === 'ar')?.name || 
                   scenario.translations.find((t: any) => t.language === 'en')?.name || 
                   'بدون اسم'}
                </TableCell>
                <TableCell>{scenario.level}</TableCell>
                <TableCell>{scenario.order_index}</TableCell>
                <TableCell>{scenario.is_free ? '✓' : '✗'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(scenario)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteMutation.mutate(scenario.id)}
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
