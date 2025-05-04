/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOutfit, getUserOutfits, deleteOutfit, updateOutfit } from '~/api/outfit';

// Fetch all user outfits
export const useGetUserOutfits = () => {
  return useQuery({
    queryKey: ['outfits'],
    queryFn: getUserOutfits,
  });
};

// Create a new outfit
export const useCreateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ images, favorite }: { images: string[]; favorite?: boolean }) =>
      createOutfit(images, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });
};

// Delete an outfit
export const useDeleteOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOutfit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
  });
};

// Update outfit favorite status
export const useUpdateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ outfitId, favorite }: { outfitId: string; favorite: boolean }) =>
      updateOutfit(outfitId, favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
    },
    onError: (error: any) => {
      console.error('Update outfit error:', error.message);
    },
  });
};
