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
      occupantId,
    }: {
      roomNumber: number;
      occupantId: string;
    }) => api.room.checkInUser(roomNumber, occupantId),
    onSuccess: (_, { roomNumber, occupantId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.byNumber(roomNumber),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.byId(occupantId),
      });
    },
  });

  const checkOutUserMutation = useMutation({
    mutationFn: (occupantId: string) => api.room.checkOutUser(occupantId),
    onSuccess: (_, occupantId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.byId(occupantId),
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
    isAddingRoom: addRoomMutation.isPending,
    isDeletingRoom: deleteRoomMutation.isPending,
    isCheckingIn: checkInUserMutation.isPending,
    isCheckingOut: checkOutUserMutation.isPending,
  };
}
