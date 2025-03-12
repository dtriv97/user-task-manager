import {
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
  Button,
  Typography,
  Container,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { User } from "../types/models";

export interface UsersTableProps {
  users: User[];
  handleCancel: () => void;
  handleCheckIn: (user: User) => void;
}

export default function UserSelectDialogTable({
  users,
  handleCancel,
  handleCheckIn,
}: UsersTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  return (
    <>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.userId}
                onClick={() => setSelectedUserId(user.userId)}
                sx={{
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  backgroundColor:
                    selectedUserId === user.userId
                      ? "rgba(25, 118, 210, 0.08)"
                      : "transparent",
                }}
              >
                <TableCell sx={{ paddingLeft: 0 }}>
                  <Container
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 2,
                      paddingLeft: 0,
                    }}
                  >
                    <Typography>
                      {user.firstName} {user.lastName}
                    </Typography>
                    {user.room !== null && (
                      <Chip label={`Room ${user.room?.roomNumber}`} />
                    )}
                  </Container>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            handleCheckIn(
              users.find((user) => user.userId === selectedUserId)!
            );
          }}
        >
          Check In
        </Button>
      </DialogActions>
    </>
  );
}
