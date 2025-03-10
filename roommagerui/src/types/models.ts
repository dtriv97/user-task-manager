export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  checkInTime?: string;
  checkOutTime?: string;
  room?: Room;
}

export interface Room {
  id: string;
  roomNumber: number;
  maxOccupancy: number;
  occupants: User[];
}
