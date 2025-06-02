/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchedule, getUserSchedules, updateSchedule, deleteSchedule } from '~/api/schedule';

// Fetch user schedules
export const useGetUserSchedules = (year?: number, month?: number) => {
  return useQuery({
    queryKey: ['schedules', year, month],
    queryFn: () => getUserSchedules(year, month),
  });
};

// Create a new schedule
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ outfitId, date }: { outfitId: string; date: string }) =>
      createSchedule(outfitId, date),
    onSuccess: (_, variables) => {
      // Invalidate queries for the specific year and month of the scheduled date
      const date = new Date(variables.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      queryClient.invalidateQueries({ queryKey: ['schedules', year, month] });
      // Also invalidate the general schedules query to cover edge cases
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};

// Update a schedule
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      scheduleId,
      outfitId,
      date,
    }: {
      scheduleId: string;
      outfitId?: string;
      date?: string;
    }) => updateSchedule(scheduleId, outfitId, date),
    onSuccess: (_, variables) => {
      // Invalidate queries for the specific year and month if date is updated
      if (variables.date) {
        const date = new Date(variables.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        queryClient.invalidateQueries({ queryKey: ['schedules', year, month] });
      }
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};

// Delete a schedule
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      // Invalidate all schedules queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
};
