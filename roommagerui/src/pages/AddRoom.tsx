import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { roomsBaseAtom } from "../atoms";

export default function AddRoom() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const refreshRooms = useSetAtom(roomsBaseAtom);

  const handleRoomSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const roomData = {
        roomNumber: Number(formData.get("roomNumber")),
        maxOccupancy: Number(formData.get("maxOccupancy")),
      };
      await api.room.addRoom(roomData.roomNumber, roomData.maxOccupancy);
      refreshRooms();
      navigate("/");
    } catch (error) {
      alert("Failed to add room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h2">Add New Room</Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleRoomSubmit(formData);
          }}
        >
          <TextField
            required
            fullWidth
            id="roomNumber"
            name="roomNumber"
            label="Room Number"
            type="number"
          />
          <TextField
            required
            fullWidth
            id="maxOccupancy"
            name="maxOccupancy"
            label="Maximum Occupancy"
            type="number"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            loading={isLoading}
          >
            Add Room
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
