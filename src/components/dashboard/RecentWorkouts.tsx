import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { WorkoutLog } from '../../types/workout';

export function RecentWorkouts() {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    async function fetchRecentWorkouts() {
      if (!user) return;

      const { data, error } = await supabase
        .from('workout_logs')
        .select(`
          *,
          workout:workouts (*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent workouts:', error);
        return;
      }

      setRecentWorkouts(data);
    }

    fetchRecentWorkouts();
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Workouts</h2>
      
      <div className="space-y-4">
        {recentWorkouts.map((log) => (
          <div key={log.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{log.workout.name}</p>
              <p className="text-sm text-gray-600">
                {format(new Date(log.completed_at), 'PPP')}
              </p>
            </div>
            <span className="text-indigo-600 font-medium">
              Score: {log.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
