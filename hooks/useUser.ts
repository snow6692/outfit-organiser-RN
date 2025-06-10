/* eslint-disable prettier/prettier */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, getUser, UserResponse } from '~/api/user';
// import { useAuth } from '~/hooks/useAuth';

export function useUser() {
  const queryClient = useQueryClient();
  // const { user: initialUser } = useAuth();

  // Fetch user data
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<UserResponse, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    // initialData: initialUser,
  });

  // Mutation to update user data
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Invalidate and refetch the user query to update the cache
      queryClient.setQueryData(['user'], updatedUser);
    },
    onError: (error: any) => {
      console.error('Update User Error:', error.message);
    },
  });

  const updateUserData = async (data: {
    name?: string;
    dateOfBirth?: string;
    image?: string | null;
  }) => {
    await updateUserMutation.mutateAsync(data);
  };

  return {
    user,
    isLoading,
    error,
    updateUser: updateUserData,
  };
}
