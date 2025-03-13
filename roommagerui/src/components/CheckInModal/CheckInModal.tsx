import React from "react";
import { Dialog, DialogTitle, CircularProgress, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSelectDialogTable from "./UserSelectDialogTable";
import { User } from "../../types/models";
import ConfirmModal, { ConfirmModalProps } from "../ConfirmModal";
import { useUsers } from "../../services/useUsers";
import { useRooms } from "../../services/useRooms";

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
        occupantId: user.userId,
      });
      alert("User checked in successfully");
      navigate(0);
    } catch (error) {
      alert("Failed to check in user. Please try again.");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  if (users.error || rooms.error) {
    alert("Failed to load users or rooms. Please try again.");
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
      >
        <DialogTitle variant="h4">Check-in users</DialogTitle>
        {loading && <CircularProgress />}
        {!loading && (
          <UserSelectDialogTable
            users={users.users}
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
        )}
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
