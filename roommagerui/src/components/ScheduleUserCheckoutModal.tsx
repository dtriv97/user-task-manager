import {
  Box,
  Button,
  Dialog,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRooms } from "../services/useRooms";

interface ScheduleUserCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkInTime: Date;
  userId: string;
}

export default function ScheduleUserCheckoutModal({
  isOpen,
  onClose,
  checkInTime,
  userId,
}: ScheduleUserCheckoutModalProps) {
  const [checkoutTime, setCheckoutTime] = useState<Dayjs | null>();
  const { scheduleCheckout, isSchedulingCheckout } = useRooms();

  useEffect(() => {
    setCheckoutTime(dayjs(checkInTime).add(2, "day"));
  }, [checkInTime]);

  const handleScheduleCheckout = () => {
    try {
      scheduleCheckout({
        userId: userId,
        checkoutTime: checkoutTime?.toDate() ?? new Date(),
      });
    } catch (e) {
      alert("Failed to schedule checkout. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          padding={5}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography
            variant="h4"
            marginBottom={5}
          >
            Schedule User Checkout
          </Typography>
          <DateTimePicker
            disablePast
            label="Checkout Time"
            defaultValue={dayjs(checkInTime).add(2, "day")}
            value={checkoutTime}
            onChange={(value) => setCheckoutTime(value)}
          />
          <Typography
            variant="body2"
            align="center"
          >
            {`User total stay time is ${dayjs(checkoutTime).diff(
              checkInTime,
              "day"
            )} days`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleScheduleCheckout}
          >
            Schedule Checkout
          </Button>
        </Box>
      </LocalizationProvider>
    </Dialog>
  );
}
