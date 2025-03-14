import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import { useCheckInModal } from "../components/CheckInModal/CheckInModal";
import { useRooms } from "../services/useRooms";

export default function Room() {
  const { roomNumber } = useParams();
  const rooms = useRooms();
  const navigate = useNavigate();
  const {
    openModal: openCheckInModal,
    CheckInDialog,
    isLoading: isCheckInLoading,
  } = useCheckInModal({ roomNumber: parseInt(roomNumber || "0") });

  if (rooms.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (rooms.error) {
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

  const room = rooms.rooms.find(
    (r) => r.roomNumber === parseInt(roomNumber || "0")
  );

  if (!room) {
    return (
      <Container>
        <Card sx={{ p: 2, mt: 2 }}>
          <Typography variant="h4">Room not found</Typography>
        </Card>
      </Container>
    );
  }

  const handleCheckIn = () => {
    openCheckInModal();
  };

  const handleCheckOut = async (userId: string) => {
    try {
      await rooms.checkOutUser(userId);
      navigate(0);
    } catch (error) {
      console.error("Failed to check out user:", error);
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
          Occupancy: {room.occupants.length} / {room.maxOccupancy}
        </Typography>

        <Typography
          variant="h4"
          sx={{ mt: 3 }}
        >
          Current Occupants:
        </Typography>
        <List>
          {room.occupants.length === 0 ? (
            <ListItem>
              <ListItemText primary="No current occupants" />
            </ListItem>
          ) : (
            room.occupants.map((occupant) => {
              return (
                <ListItem key={occupant.userId}>
                  <ListItemText
                    primary={`${occupant.firstName} ${occupant.lastName}`}
                    secondary={`Checked In: ${formatTime(
                      occupant.checkInTime
                    )}`}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCheckOut(occupant.userId)}
                  >
                    Check Out
                  </Button>
                </ListItem>
              );
            })
          )}
        </List>
      </Card>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        {isCheckInLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckIn}
            disabled={room.occupants.length >= room.maxOccupancy}
          >
            Check In New User
          </Button>
        )}
      </Box>

      <CheckInDialog roomNumber={room.roomNumber} />
    </Container>
  );
}
