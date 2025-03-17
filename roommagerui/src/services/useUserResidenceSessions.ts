import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { queryKeys } from "../services/api";

export function useUserResidenceSession(userId: string) {
  return useQuery({
    queryKey: queryKeys.userResidenceSessions.byUserId(userId),
    queryFn: () => api.userResidenceSession.getUserResidenceSession(userId),
  });
}

export function useUserResidenceSessions() {
  const queryClient = useQueryClient();

  const {
    data: userResidenceSessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.userResidenceSessions.all,
    queryFn: api.userResidenceSession.getAllUserResidenceSessions,
  });

  return {
    userResidenceSessions,
    isLoading,
    error,
  };
}
