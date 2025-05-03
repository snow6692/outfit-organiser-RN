/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOutfit,
  getUserOutfits,
  deleteOutfit,
  getWishlistOutfits,
  toggleWishlist,
} from '~/api/outfit';

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

// New hook for wishlisted outfits
export const useGetWishlistOutfits = () => {
  return useQuery({
    queryKey: ['wishlistOutfits'],
    queryFn: getWishlistOutfits,
  });
};

// New hook for toggling wishlist
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistOutfits'] });
    },
  });
};
