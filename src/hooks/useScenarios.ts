import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';

export function useScenarios() {
  const { currentLevel, uiLanguage } = useApp();

  return useQuery({
    queryKey: ['scenarios', currentLevel, uiLanguage],
    queryFn: async () => {
      const { data: scenarios, error } = await supabase
        .from('scenarios')
        .select(`
          id,
          level,
          icon,
          order_index,
          is_free,
          scenario_translations!inner (
            name,
            description,
            language
          )
        `)
        .eq('level', currentLevel)
        .eq('scenario_translations.language', uiLanguage)
        .order('order_index');

      if (error) throw error;

      return scenarios?.map(s => ({
        id: s.id,
        level: s.level,
        icon: s.icon,
        orderIndex: s.order_index,
        isFree: s.is_free,
        name: s.scenario_translations[0]?.name || 'Untitled',
        description: s.scenario_translations[0]?.description || ''
      })) || [];
    }
  });
}

export function useLessons(scenarioId: string | null) {
  const { uiLanguage } = useApp();

  return useQuery({
    queryKey: ['lessons', scenarioId, uiLanguage],
    enabled: !!scenarioId,
    queryFn: async () => {
      if (!scenarioId) return [];

      const { data: lessons, error } = await supabase
        .from('lessons')
        .select(`
          id,
          scenario_id,
          order_index,
          duration_minutes,
          xp_reward,
          lesson_translations!inner (
            title,
            content,
            language
          )
        `)
        .eq('scenario_id', scenarioId)
        .eq('lesson_translations.language', uiLanguage)
        .order('order_index');

      if (error) throw error;

      return lessons?.map(l => ({
        id: l.id,
        scenarioId: l.scenario_id,
        orderIndex: l.order_index,
        durationMinutes: l.duration_minutes,
        xpReward: l.xp_reward,
        title: l.lesson_translations[0]?.title || 'Untitled',
        content: l.lesson_translations[0]?.content || ''
      })) || [];
    }
  });
}

export function useVocabulary(lessonId: string | null) {
  const { uiLanguage } = useApp();

  return useQuery({
    queryKey: ['vocabulary', lessonId, uiLanguage],
    enabled: !!lessonId,
    queryFn: async () => {
      if (!lessonId) return [];

      const { data: vocabulary, error } = await supabase
        .from('vocabulary')
        .select(`
          id,
          german_word,
          article,
          plural,
          order_index,
          vocabulary_translations!inner (
            translation,
            example_sentence,
            language
          )
        `)
        .eq('lesson_id', lessonId)
        .eq('vocabulary_translations.language', uiLanguage)
        .order('order_index');

      if (error) throw error;

      return vocabulary?.map(v => ({
        id: v.id,
        germanWord: v.german_word,
        article: v.article,
        plural: v.plural,
        orderIndex: v.order_index,
        translation: v.vocabulary_translations[0]?.translation || '',
        exampleSentence: v.vocabulary_translations[0]?.example_sentence || ''
      })) || [];
    }
  });
}
