import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, GraduationCap, Languages, Loader2 } from 'lucide-react';
import { AdminScenarios } from '@/components/admin/AdminScenarios';
import { AdminLessons } from '@/components/admin/AdminLessons';
import { AdminVocabulary } from '@/components/admin/AdminVocabulary';

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isAdminLoading } = useAdminRole();
  const { isLoading: isAuthLoading } = useAuthContext();

  if (isAuthLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">غير مصرح</h1>
          <p className="text-muted-foreground">ليس لديك صلاحية للوصول إلى لوحة التحكم</p>
          <Button onClick={() => navigate('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              السيناريوهات
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              الدروس
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              المفردات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios">
            <AdminScenarios />
          </TabsContent>

          <TabsContent value="lessons">
            <AdminLessons />
          </TabsContent>

          <TabsContent value="vocabulary">
            <AdminVocabulary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
