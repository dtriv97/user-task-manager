import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useUserResidenceSession } from "../services/useUserResidenceSessions";
import { formatTime } from "../utils/formatTime";
import ScheduleUserCheckoutModal from "./ScheduleUserCheckoutModal";
import { useState } from "react";

export interface UserResidenceStatusProps {
  userId: string;
  checkOutFn: (userId: string) => void;
}

export default function UserResidenceStatus({
  userId,
  checkOutFn,
}: UserResidenceStatusProps) {
  const userResidenceSession = useUserResidenceSession(userId);
  const [isScheduleCheckoutModalOpen, setIsScheduleCheckoutModalOpen] =
    useState(false);

  if (
    userResidenceSession.error ||
    userResidenceSession.data == null ||
    userResidenceSession.data.user == null
  ) {
    return (
      <Card>
        <Typography>Error loading user status</Typography>
      </Card>
    );
  }

  return (
    <>
      {userResidenceSession.isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Card sx={{ padding: 2, maxWidth: 300 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography
                  variant="h4"
                  gutterBottom
                >
                  {`${userResidenceSession.data.user.firstName} ${userResidenceSession.data.user.lastName}`}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  {userResidenceSession.data?.checkInTime
                    ? `Checked In: ${formatTime(
                        userResidenceSession.data.checkInTime
                      )}`
                    : ""}
                </Typography>
                {userResidenceSession.data.scheduledCheckoutTime ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {`Scheduled Check-Out: ${formatTime(
                      userResidenceSession.data.scheduledCheckoutTime,
                      true
                    )}`}
                  </Typography>
                ) : null}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
                gap={2}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setIsScheduleCheckoutModalOpen(true)}
                  size="small"
                  disableTouchRipple
                  disableRipple
                >
                  {userResidenceSession.data.scheduledCheckoutTime
                    ? "Update"
                    : "Schedule Checkout"}
                </Button>
                <Button
                  disableTouchRipple
                  disableRipple
                  fullWidth
                  sx={{
                    backgroundColor: "rgba(223, 13, 76, 0.75)",
                    color: "white",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => checkOutFn(userId)}
                >
                  Check Out
                </Button>
              </Box>
            </Box>
          </Card>
          <ScheduleUserCheckoutModal
            isOpen={isScheduleCheckoutModalOpen}
            onClose={() => setIsScheduleCheckoutModalOpen(false)}
            userResidenceSession={userResidenceSession.data}
          />
        </>
      )}
    </>
  );
}
