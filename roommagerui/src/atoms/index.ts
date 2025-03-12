import { atom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";
import api from "../services/api";
import { Room, User } from "../types/models";

export const roomsBaseAtom = atomWithRefresh<Promise<Room[]>>(async () => {
  try {
    var rooms = await api.room.getAllRooms();
    return rooms.sort((a, b) => a.roomNumber - b.roomNumber);
  } catch (error) {
    return [];
  }
});

export const roomsAtom = loadable(roomsBaseAtom);

export const usersAtom = atomWithRefresh<Promise<User[]>>(async () => {
  try {
    const users = await api.user.getAllUsers();
    return users;
  } catch (error) {
    return [];
  }
});

export const usersLoadable = loadable(usersAtom);
