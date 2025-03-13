import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { useUsers } from "../services/useUsers";

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const users = useUsers();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (users.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.error) {
    return (
      <Box>
        <Typography>User doesn't exist</Typography>
      </Box>
    );
  }

  const user = users.users.find((u) => u.userId === userId);

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
      await users.deleteUser(user.userId);
      alert("User deleted successfully");
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
