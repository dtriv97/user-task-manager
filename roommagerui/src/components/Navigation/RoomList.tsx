import { Add } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  List,
  ListItemButton,
  Chip,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { Link, useNavigate } from "react-router-dom";
import { roomsAtom } from "../../atoms";

export default function RoomList() {
  const navigate = useNavigate();
  const roomAtom = useAtomValue(roomsAtom);

  return (
    <Box sx={{ overflow: "auto", flexGrow: 1, maxHeight: "50%" }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          paddingTop: 1.5,
        }}
      >
        <Typography
          variant="h4"
          color="#1a1a1a"
        >
          Rooms
        </Typography>
        <Link to="/add-new-room">
          <IconButton>
            <Add
              sx={{
                color: "#1a1a1a",
                border: "1px solid #1a1a1a",
                borderRadius: "50%",
              }}
            />
          </IconButton>
        </Link>
      </Container>
      {roomAtom.state === "loading" && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {roomAtom.state === "hasData" && (
        <List>
          {roomAtom.data.map((room) => (
            <ListItemButton
              disableTouchRipple
              key={room.roomNumber}
              sx={{
                gap: 2,
                paddingBottom: 1.5,
                paddingTop: 1.5,
                paddingLeft: 2,
              }}
              onClick={() => navigate(`/room/${room.roomNumber}`)}
            >
              <Typography
                variant="body2"
                key={room.roomNumber}
              >
                {`Room #${room.roomNumber}`}
              </Typography>
              <Chip
                label={
                  room.occupants.length < room.maxOccupancy
                    ? `Available (${room.maxOccupancy - room.occupants.length})`
                    : "Fully Occupied"
                }
                sx={{ opacity: "75%" }}
                variant="outlined"
                size="small"
                color={
                  room.occupants.length < room.maxOccupancy
                    ? "success"
                    : "error"
                }
              />
            </ListItemButton>
          ))}
          {roomAtom.data.length === 0 && (
            <Typography
              variant="body1"
              sx={{ padding: 2 }}
            >
              No rooms available
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
}
