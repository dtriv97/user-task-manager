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
import { User } from "../../types/models";
import ConfirmModal, { ConfirmModalProps } from "../ConfirmModal";
import { useUsers } from "../../services/useUsers";
import { useRooms } from "../../services/useRooms";
import { toast } from "react-toast";

interface CheckInModalReturn {
  isLoading: boolean;
  openModal: () => void;
  CheckInDialog: (props: CheckInModalProps) => React.ReactElement | null;
}

interface CheckInModalProps {
  roomNumber: number;
}

export function useCheckInModal({
  roomNumber,
}: CheckInModalProps): CheckInModalReturn {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmModalProps, setConfirmModalProps] =
    useState<ConfirmModalProps | null>(null);
  const users = useUsers();
  const rooms = useRooms();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckIn = async (user: User) => {
    try {
      setLoading(true);
      await rooms.checkInUser({
        roomNumber,
        userId: user.userId,
      });
      toast.success("User checked in successfully");
      navigate(0);
    } catch (error) {
      toast.error("Failed to check in user. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  if (users.error || rooms.error) {
    toast.error("Failed to load users or rooms. Please try again.");
    return {
      isLoading: false,
      openModal: () => {},
      CheckInDialog: () => null,
    };
  }

  if (users.isLoading || rooms.isLoading) {
    return {
      isLoading: true,
      openModal: () => {},
      CheckInDialog: () => null,
    };
  }

  const CheckInDialog = () => (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
              minHeight: "60vh",
              maxHeight: "80vh",
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
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
            <DialogContent>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: "text.secondary",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                }}
              >
                Select a user to check into Room {roomNumber}
              </Typography>
              <UserSelectDialogTable
                users={users.users.filter(
                  (user) => user.room?.roomNumber !== roomNumber
                )}
                handleCancel={handleClose}
                handleCheckIn={(user) => {
                  if (user.room !== null) {
                    setConfirmModalProps({
                      title: `${user.firstName} ${user.lastName} already checked into Room ${user.room?.roomNumber}`,
                      message: `Would you like to check them out and into Room ${roomNumber}?`,
                      onConfirm: () => {
                        handleCheckIn(user);
                      },
                      onCancel: () => {
                        setConfirmModalProps(null);
                      },
                    });
                  } else {
                    handleCheckIn(user);
                  }
                }}
              />
            </DialogContent>
          )}
        </Box>
      </Dialog>
      {confirmModalProps !== null && <ConfirmModal {...confirmModalProps} />}
    </>
  );

  return {
    isLoading: false,
    openModal: handleOpen,
    CheckInDialog,
  };
}
