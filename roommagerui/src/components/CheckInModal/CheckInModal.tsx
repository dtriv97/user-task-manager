import React from "react";
import { Dialog, DialogTitle, CircularProgress, Alert } from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { usersAtom, usersLoadable } from "../../atoms";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import UserSelectDialogTable from "./UserSelectDialogTable";
import { User } from "../../types/models";
import ConfirmModal, { ConfirmModalProps } from "../ConfirmModal";

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
  const userAtomData = useAtomValue(usersLoadable);

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
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle variant="h4">Check-in users</DialogTitle>
        {loading && <CircularProgress />}
        {!loading && (
          <UserSelectDialogTable
            users={users}
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
