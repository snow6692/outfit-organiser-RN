/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useQuery } from '@tanstack/react-query';
import { getCategoryById } from '~/api/category';
import { categoriesTypes } from '../../back/src/types/category.types';

export const useGetCategoryById = (categoryId: string | null) => {
  return useQuery<categoriesTypes, Error>({
    queryKey: ['category', categoryId],
    queryFn: () => {
      if (!categoryId) throw new Error('Category ID is required');
      return getCategoryById(categoryId);
    },
    enabled: !!categoryId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
