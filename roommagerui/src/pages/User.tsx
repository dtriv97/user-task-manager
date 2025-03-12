import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { usersLoadable } from "../atoms";
import { useState } from "react";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const userLoadableAtom = useAtomValue(usersLoadable);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (userLoadableAtom.state === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userLoadableAtom.state === "hasError") {
    return (
      <Box>
        <Typography>User doesn't exist</Typography>
      </Box>
    );
  }

  const user = userLoadableAtom.data.find((u) => u.userId === userId);
  console.log(userLoadableAtom.data);

  if (!user) {
    return (
      <Container>
        <Typography variant="h4">User not found</Typography>
      </Container>
    );
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.user.deleteUser(userId!);
      navigate("/");
    } catch (error) {
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h2">User Details</Typography>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h5">
            Name: {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1">User ID: {user.userId}</Typography>
          {user.room?.roomNumber && (
            <Typography variant="body1">
              Room: {user.room.roomNumber}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDeleting}
          >
            Delete User
          </Button>
        </Box>
      </Card>

      {showConfirmDelete && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </Container>
  );
}
