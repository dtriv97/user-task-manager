import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { useUserResidenceSession } from "../services/useUserResidenceSessions";
import { formatTime } from "../utils/formatTime";
import ScheduleUserCheckoutModal from "./ScheduleUserCheckoutModal";
import { useState } from "react";
export interface UserResidenceStatusProps {
  userId: string;
}

export default function UserResidenceStatus({
  userId,
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
      <Box>
        <Typography>Error loading user status</Typography>
      </Box>
    );
  }

  return (
    <>
      {userResidenceSession.isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width={"100%"}
          >
            <Box gap={2}>
              <Typography variant="h4">
                {`${userResidenceSession.data.user.firstName} ${userResidenceSession.data.user.lastName}`}
              </Typography>
              <Typography variant="body1">
                {userResidenceSession.data?.checkInTime
                  ? `Checked In: ${formatTime(
                      userResidenceSession.data.checkInTime
                    )}`
                  : ""}
              </Typography>
              {userResidenceSession.data.scheduledCheckoutTime ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  {`Scheduled Check-Out: ${formatTime(
                    userResidenceSession.data.scheduledCheckoutTime,
                    true
                  )}`}
                </Typography>
              ) : (
                <Button onClick={() => setIsScheduleCheckoutModalOpen(true)}>
                  Schedule Checkout
                </Button>
              )}
            </Box>
            <Button color="error">Check Out</Button>
          </Box>
          <ScheduleUserCheckoutModal
            isOpen={isScheduleCheckoutModalOpen}
            onClose={() => setIsScheduleCheckoutModalOpen(false)}
            checkInTime={new Date(userResidenceSession.data.checkInTime)}
            userId={userId}
          />
        </>
      )}
    </>
  );
}
