import {
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUsers } from "../services/useUsers";
import { toast } from "react-toast";

export default function AddUser() {
  const users = useUsers();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const userData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
      };
      var userSuccess = await users.addUser({ ...userData });
      navigate(`/user/${userSuccess.userId}`);
    } catch (error) {
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h2">Add New User</Typography>
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
            await handleUserSubmit(formData);
          }}
        >
          <TextField
            required
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
          />
          <TextField
            required
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
