export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  room?: Room;
}

export interface Room {
  id: string;
  roomNumber: number;
  maxOccupancy: number;
  occupants: User[];
}

export interface UserResidenceSession {
  id: string;
  user: User;
  room: Room;
  checkInTime: string;
  checkOutTime?: string;
  scheduledCheckoutTime?: string;
}
