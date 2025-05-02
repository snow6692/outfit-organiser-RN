/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '~/api/category';
import { categoriesTypes } from '../../back/src/types/category.types';
// Define the shape of a category

export const useGetAllCategories = () => {
  return useQuery<categoriesTypes[], Error>({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });
};
