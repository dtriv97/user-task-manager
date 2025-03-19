import axios, { AxiosError } from "axios";
import { Room, User, UserResidenceSession } from "../types/models";

const APP_ORIGIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5220"
    : process.env.API_ORIGIN_URL;

const API_BASE_URL = `${APP_ORIGIN_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const queryKeys = {
  rooms: {
    all: ["rooms"] as const,
    byNumber: (roomNumber: number) => ["rooms", roomNumber] as const,
  },
  users: {
    all: ["users"] as const,
    byId: (userId: string) => ["users", userId] as const,
  },
  userResidenceSessions: {
    all: ["userResidenceSessions"] as const,
    byUserId: (userId: string) => ["userResidenceSessions", userId] as const,
    byRoomId: (roomId: string) => ["userResidenceSessions", roomId] as const,
  },
};

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

api.interceptors.response.use(
  (response) => {
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

  checkInUser: async (roomNumber: number, userId: string): Promise<Room> => {
    const response = await api.post("/room/checkInUser", {
      roomNumber,
      userId,
    });
    return response.data;
  },

  checkOutUser: async (roomId: string, userId: string): Promise<User> => {
    const response = await api.post("/room/checkOutUser", { roomId, userId });
    return response.data;
  },

  scheduleCheckout: async (
    userId: string,
    checkoutTime: Date
  ): Promise<UserResidenceSession> => {
    const response = await api.post("/room/scheduleUserCheckout", {
      userId,
      checkoutTime,
    });
    return response.data;
  },

  updateScheduledCheckout: async (
    userId: string,
    roomId: string,
    updatedCheckout: Date
  ): Promise<UserResidenceSession> => {
    const response = await api.post("/room/updateScheduledUserCheckout", {
      userId,
      roomId,
      updatedCheckout,
    });
    return response.data;
  },
};

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

// User Residence Session API endpoints
export const userResidenceSessionApi = {
  getAllUserResidenceSessions: async (): Promise<UserResidenceSession[]> => {
    const response = await api.get(
      "/userResidenceSession/getAllUserResidenceSessions"
    );
    return response.data;
  },

  getUserResidenceSession: async (
    userId: string
  ): Promise<UserResidenceSession> => {
    const response = await api.post(
      "/userResidenceSession/getUserResidenceSession",
      { userId }
    );
    return response.data;
  },
};

const apis = {
  room: roomApi,
  user: userApi,
  userResidenceSession: userResidenceSessionApi,
};

export default apis;
