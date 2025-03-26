import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useRooms } from "../services/useRooms";
import { Group } from "@mui/icons-material";
import UserResidenceStatus from "../components/UserResidenceStatus";
import { toast } from "react-toast";
import CheckInModal from "../components/CheckInModal/CheckInModal";
import { useState } from "react";

export default function Room() {
  const { roomNumber } = useParams();
  const { rooms, isLoading, error, checkOutUser } = useRooms();
  const [showCheckIn, setShowCheckIn] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Card sx={{ p: 2, mt: 2 }}>
          <Typography
            variant="h4"
            color="error"
          >
            Error loading data
          </Typography>
        </Card>
      </Container>
    );
  }

  const room = rooms.find((r) => r.roomNumber === parseInt(roomNumber || "0"));

  if (!room) {
    return (
      <Container>
        <Card sx={{ p: 2, mt: 2 }}>
          <Typography variant="h4">
            There is an issue with the system, please try again later.
          </Typography>
        </Card>
      </Container>
    );
  }

  const handleCheckOut = async (userId: string) => {
    try {
      await checkOutUser({ roomId: room.id, userId });
      toast.success("User checked out successfully");
    } catch (error) {
      toast.error("Failed to check out user. Please try again.");
    }
  };

  return (
    <Container>
      <Card sx={{ p: 2, mt: 2 }}>
        <Typography variant="h2">Room #{room.roomNumber}</Typography>
        <Typography
          variant="h4"
          sx={{ mt: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Group />
            {`${room.occupants.length} / ${room.maxOccupancy}`}
          </Box>
        </Typography>
      </Card>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          flexDirection: "row",
        }}
      >
        {room.occupants?.length > 0 &&
          room.occupants.map((user) => {
            return (
              <UserResidenceStatus
                userId={user.userId}
                checkOutFn={handleCheckOut}
                key={user.userId}
              />
            );
          })}
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          disableRipple
          variant="contained"
          color="primary"
          onClick={() => setShowCheckIn(true)}
          disabled={room.occupants.length >= room.maxOccupancy}
        >
          Check In New User
        </Button>
      </Box>
      {showCheckIn && (
        <CheckInModal
          room={room}
          onClose={() => setShowCheckIn(false)}
        />
      )}
    </Container>
  );
}
