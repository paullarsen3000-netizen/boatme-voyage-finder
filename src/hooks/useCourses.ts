import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Course = Database['public']['Tables']['courses']['Row'];

interface CourseFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
}

export function useCourses(filters?: CourseFilters) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('courses')
        .select('*')
        .eq('status', 'active');

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
      }

      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, refetch: fetchCourses };
}

export function useCourseById(id: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading, error };
}