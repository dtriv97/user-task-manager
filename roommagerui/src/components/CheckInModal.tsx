import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { usersAtom } from "../atoms";
import { formatTime } from "../utils/formatTime";
import api from "../services/api";

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
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const userAtomData = useAtomValue(usersAtom);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId("");
  };

  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      await api.room.checkInUser(roomNumber, selectedUserId);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
      sx={{ p: 0 }}
    >
      <DialogTitle variant="h4">Check In User: Room {roomNumber}</DialogTitle>
      <DialogContent>
        <FormControl
          fullWidth
          sx={{ mt: 2 }}
          onSubmit={handleCheckIn}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Check In Time</TableCell>
                  <TableCell>Check Out Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.userId}
                    onClick={() => setSelectedUserId(user.userId)}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5",
                      },
                      backgroundColor:
                        selectedUserId === user.userId
                          ? "action.selected"
                          : "transparent",
                    }}
                  >
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{formatTime(user.checkInTime)}</TableCell>
                    <TableCell>{formatTime(user.checkOutTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!selectedUserId}
          type="submit"
        >
          Check In
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    isLoading: false,
    openModal: handleOpen,
    CheckInDialog,
  };
}
