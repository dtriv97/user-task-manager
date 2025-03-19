import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { queryKeys } from "../services/api";

export function useRooms() {
  const queryClient = useQueryClient();

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.rooms.all,
    queryFn: api.room.getAllRooms,
    select: (data) => data.sort((a, b) => a.roomNumber - b.roomNumber),
  });

  const addRoomMutation = useMutation({
    mutationFn: ({
      roomNumber,
      maxOccupancy,
    }: {
      roomNumber: number;
      maxOccupancy: number;
    }) => api.room.addRoom(roomNumber, maxOccupancy),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      return room;
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (roomNumber: number) => api.room.deleteRoom(roomNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });

  const checkInUserMutation = useMutation({
    mutationFn: ({
      roomNumber,
      userId,
    }: {
      roomNumber: number;
      userId: string;
    }) => api.room.checkInUser(roomNumber, userId),
    onSuccess: (_, { roomNumber, userId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.byNumber(roomNumber),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.byId(userId),
      });
    },
  });

  const checkOutUserMutation = useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      api.room.checkOutUser(roomId, userId),
    onSuccess: (_, { roomId, userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.byId(userId),
      });
    },
  });

  const scheduleCheckoutMutation = useMutation({
    mutationFn: ({
      userId,
      checkoutTime,
    }: {
      userId: string;
      checkoutTime: Date;
    }) => api.room.scheduleCheckout(userId, checkoutTime),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.byId(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userResidenceSessions.byUserId(userId),
      });
    },
  });

  const updateScheduledCheckoutMutation = useMutation({
    mutationFn: ({
      userId,
      roomId,
      updatedCheckout,
    }: {
      userId: string;
      roomId: string;
      updatedCheckout: Date;
    }) => api.room.updateScheduledCheckout(userId, roomId, updatedCheckout),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userResidenceSessions.byUserId(userId),
      });
    },
  });

  return {
    rooms,
    isLoading,
    error,
    addRoom: addRoomMutation.mutateAsync,
    deleteRoom: deleteRoomMutation.mutateAsync,
    checkInUser: checkInUserMutation.mutateAsync,
    checkOutUser: checkOutUserMutation.mutateAsync,
    scheduleCheckout: scheduleCheckoutMutation.mutateAsync,
    updateScheduledCheckout: updateScheduledCheckoutMutation.mutateAsync,
    isAddingRoom: addRoomMutation.isPending,
    isDeletingRoom: deleteRoomMutation.isPending,
    isCheckingIn: checkInUserMutation.isPending,
    isCheckingOut: checkOutUserMutation.isPending,
    isSchedulingCheckout: scheduleCheckoutMutation.isPending,
    isUpdatingScheduledCheckout: updateScheduledCheckoutMutation.isPending,
  };
}
