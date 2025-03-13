import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { queryKeys } from "../services/api";

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: api.user.getAllUsers,
  });

  const addUserMutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) => api.user.addUser(firstName, lastName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.user.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    users,
    isLoading,
    error,
    addUser: addUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isAddingUser: addUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
