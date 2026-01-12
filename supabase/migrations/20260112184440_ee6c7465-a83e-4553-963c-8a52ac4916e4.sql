-- Add RLS policies for admins to manage scenarios
CREATE POLICY "Admins can insert scenarios"
ON public.scenarios
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update scenarios"
ON public.scenarios
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete scenarios"
ON public.scenarios
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage scenario_translations
CREATE POLICY "Admins can insert scenario translations"
ON public.scenario_translations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update scenario translations"
ON public.scenario_translations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete scenario translations"
ON public.scenario_translations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage lessons
CREATE POLICY "Admins can insert lessons"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons"
ON public.lessons
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons"
ON public.lessons
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage lesson_translations
CREATE POLICY "Admins can insert lesson translations"
ON public.lesson_translations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lesson translations"
ON public.lesson_translations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lesson translations"
ON public.lesson_translations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage vocabulary
CREATE POLICY "Admins can insert vocabulary"
ON public.vocabulary
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vocabulary"
ON public.vocabulary
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vocabulary"
ON public.vocabulary
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage vocabulary_translations
CREATE POLICY "Admins can insert vocabulary translations"
ON public.vocabulary_translations
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vocabulary translations"
ON public.vocabulary_translations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vocabulary translations"
ON public.vocabulary_translations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));