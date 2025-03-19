import { Box, Button, Dialog, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useRooms } from "../services/useRooms";
import { UserResidenceSession } from "../types/models";
import { toast } from "react-toast";

interface ScheduleUserCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userResidenceSession: UserResidenceSession;
}

export default function ScheduleUserCheckoutModal({
  isOpen,
  onClose,
  userResidenceSession,
}: ScheduleUserCheckoutModalProps) {
  const [checkoutTime, setCheckoutTime] = useState<Dayjs | null>();
  const { scheduleCheckout } = useRooms();

  useEffect(() => {
    if (userResidenceSession.scheduledCheckoutTime !== null) {
      setCheckoutTime(dayjs(userResidenceSession.scheduledCheckoutTime));
    } else {
      setCheckoutTime(dayjs(userResidenceSession.checkInTime).add(2, "day"));
    }
  }, [userResidenceSession]);

  const handleScheduleCheckout = () => {
    try {
      scheduleCheckout({
        userId: userResidenceSession.user.userId,
        checkoutTime: checkoutTime?.toDate() ?? new Date(),
      });
    } catch (e) {
      toast.error("Failed to schedule checkout. Please try again.");
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
            defaultValue={dayjs(userResidenceSession.checkInTime).add(2, "day")}
            value={checkoutTime}
            onChange={(value) => setCheckoutTime(value)}
          />
          <Typography
            variant="body2"
            align="center"
          >
            {`User total stay time is ${dayjs(checkoutTime).diff(
              userResidenceSession.checkInTime,
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
