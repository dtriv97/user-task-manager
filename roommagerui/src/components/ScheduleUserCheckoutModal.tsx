import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";
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
      maxWidth="sm"
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Typography variant="h4">Schedule User Checkout</Typography>
          </DialogTitle>
          <DialogContent sx={{ paddingTop: "24px !important" }}>
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
            >
              <DateTimePicker
                disablePast
                label="Checkout Time"
                defaultValue={dayjs(userResidenceSession.checkInTime).add(
                  2,
                  "day"
                )}
                value={checkoutTime}
                onChange={(value) => setCheckoutTime(value)}
                sx={{ width: "100%" }}
              />
              <Typography
                variant="body1"
                align="center"
                color="text.secondary"
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
                size="large"
                sx={{ mt: 2 }}
              >
                Schedule Checkout
              </Button>
            </Box>
          </DialogContent>
        </Box>
      </LocalizationProvider>
    </Dialog>
  );
}
