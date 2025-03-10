import axios from "axios";
import { Room, User } from "../types/models";

const API_BASE_URL = "http://localhost:5220/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Room API endpoints
export const roomApi = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get("/room/getAllRooms");
    return response.data;
  },

  getRoom: async (roomNumber: number): Promise<Room> => {
    const response = await api.post("/room/getRoom", { roomNumber });
    return response.data;
  },

  addRoom: async (roomNumber: number, maxOccupancy: number): Promise<Room> => {
    const response = await api.post("/room/addRoom", {
      roomNumber,
      maxOccupancy,
    });
    return response.data;
  },

  deleteRoom: async (roomNumber: number): Promise<Room> => {
    const response = await api.post("/room/deleteRoom", { roomNumber });
    return response.data;
  },

  checkInUser: async (
    roomNumber: number,
    occupantId: string
  ): Promise<Room> => {
    const response = await api.post("/room/checkInUser", {
      roomNumber,
      occupantId,
    });
    return response.data;
  },

  checkOutUser: async (occupantId: string): Promise<User> => {
    const response = await api.post("/room/checkOutUser", { occupantId });
    return response.data;
  },
};

// User API endpoints
export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/user/getAllUsers");
    return response.data;
  },

  addUser: async (firstName: string, lastName: string): Promise<User> => {
    const response = await api.post("/user/addUser", { firstName, lastName });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<User> => {
    const response = await api.post("/user/deleteUser", { userId });
    return response.data;
  },
};

export default {
  room: roomApi,
  user: userApi,
};
