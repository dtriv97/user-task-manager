import React from "react";
import {
  Dialog,
  DialogTitle,
  CircularProgress,
  Box,
  Typography,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSelectDialogTable from "./UserSelectDialogTable";
import { Room, User } from "../../types/models";
import { useUsers } from "../../services/useUsers";
import { useRooms } from "../../services/useRooms";
import { toast } from "react-toast";

interface CheckInModalProps {
  room: Room;
  onClose: () => void;
}

export default function CheckInModal({ room, onClose }: CheckInModalProps) {
  const { checkInUser } = useRooms();
  const [loading, setLoading] = useState(false);
  const users = useUsers();

  const handleCheckIn = async (users: User[]) => {
    if (users.length > room.maxOccupancy - room.occupants?.length) {
      toast.error("Cannot check in more users than the room can hold.");
      return;
    }

    try {
      setLoading(true);
      await Promise.all(
        users.map((user) =>
          checkInUser({
            roomNumber: room.roomNumber,
            userId: user.userId,
          })
        )
      );
      toast.success("All users checked in successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to check in all users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            },
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogTitle
            sx={{
              pb: 3,
              borderBottom: "1px solid",
            }}
          >
            <Typography variant="h4">Check-in Users</Typography>
          </DialogTitle>
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )}
          {!loading && (
            <DialogContent sx={{ paddingTop: "inherit !important" }}>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Select user(s) to check into Room {room.roomNumber}
              </Typography>
              {users.error ? (
                <Typography>Failed to load users. Please try again.</Typography>
              ) : (
                <UserSelectDialogTable
                  users={users.users.filter((user) => user.room === null)}
                  handleCancel={onClose}
                  handleCheckIn={handleCheckIn}
                />
              )}
            </DialogContent>
          )}
        </Box>
      </Dialog>
    </>
  );
}
