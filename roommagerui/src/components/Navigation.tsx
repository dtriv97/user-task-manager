import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { roomsAtom } from "../atoms";
import { Link, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 240;

export default function Navigation() {
  const roomAtom = useAtomValue(roomsAtom);
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ overflow: "auto", flexGrow: 1 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Typography
            variant="h4"
            sx={{ p: 2 }}
          >
            Room Manager
          </Typography>
        </Link>
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
                sx={{ gap: 2 }}
                onClick={() => navigate(`/room/${room.roomNumber}`)}
              >
                <Typography
                  variant="h4"
                  key={room.roomNumber}
                >
                  {`Room #${room.roomNumber}`}
                </Typography>
                <Chip
                  label={
                    room.occupants.length < room.maxOccupancy
                      ? "Available"
                      : "Occupied"
                  }
                  sx={{ opacity: "75%" }}
                  variant="outlined"
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
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 1 }}
          onClick={() => navigate("/add-new-room")}
        >
          Add New Room
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/new-user")}
        >
          Add New User
        </Button>
      </Box>
    </Drawer>
  );
}
