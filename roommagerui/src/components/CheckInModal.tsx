import React from "react";
import { Dialog, DialogTitle, CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { usersAtom } from "../atoms";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import UserSelectDialogTable from "./UserSelectDialogTable";
import { User } from "../types/models";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userAtomData = useAtomValue(usersAtom);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckIn = async (user: User) => {
    try {
      setLoading(true);
      await api.room.checkInUser(roomNumber, user.userId);
      navigate(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  if (userAtomData.state === "loading" || userAtomData.state === "hasError") {
    return {
      isLoading: true,
      openModal: () => {},
      CheckInDialog: () => null,
    };
  }

  const users = userAtomData.data;

  const CheckInDialog = () => (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle variant="h4">Check In User: Room {roomNumber}</DialogTitle>
      {loading && <CircularProgress />}
      {!loading && (
        <UserSelectDialogTable
          users={users}
          handleCancel={handleClose}
          handleCheckIn={handleCheckIn}
        />
      )}
    </Dialog>
  );

  return {
    isLoading: false,
    openModal: handleOpen,
    CheckInDialog,
  };
}
