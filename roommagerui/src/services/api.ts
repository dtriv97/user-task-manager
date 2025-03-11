import axios, { AxiosError } from "axios";
import { Room, User } from "../types/models";

const API_BASE_URL = "http://localhost:5220/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`,
      config
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error: AxiosError) => {
    console.error("Response error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// Room API endpoints
export const roomApi = {
  getAllRooms: async (): Promise<Room[]> => {
    try {
      const response = await api.get("/room/getAllRooms");
      return response.data;
    } catch (error) {
      console.error("Error in getAllRooms:", error);
      throw error;
    }
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
