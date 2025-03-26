import {
  DialogContent,
  Table,
  TableRow,
  TableCell,
  TableBody,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../types/models";

export interface UsersTableProps {
  users: User[];
  handleCancel: () => void;
  handleCheckIn: (users: User[]) => void;
}

export default function UserSelectDialogTable({
  users,
  handleCancel,
  handleCheckIn,
}: UsersTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <DialogContent sx={{ padding: 0, flex: 1 }}>
        <Table>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.userId}
                onClick={() => {
                  if (selectedUsers.includes(user.userId)) {
                    setSelectedUsers(
                      selectedUsers.filter((id) => id !== user.userId)
                    );
                  } else {
                    setSelectedUsers([...selectedUsers, user.userId]);
                  }
                }}
                sx={{
                  transition: "background-color 0.1s ease-out",
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  backgroundColor: selectedUsers.includes(user.userId)
                    ? "rgba(25, 118, 210, 0.08)"
                    : "transparent",
                }}
              >
                <TableCell>
                  <Typography>
                    {user.firstName} {user.lastName}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 2,
          justifyContent: "flex-end",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          variant="contained"
          disabled={selectedUsers.length === 0}
          onClick={() => {
            handleCheckIn(
              users.filter((user) => selectedUsers.includes(user.userId))
            );
          }}
        >
          Check In{" "}
          {selectedUsers.length > 0 &&
            `${selectedUsers.length} ${
              selectedUsers.length === 1 ? "user" : "users"
            }`}
        </Button>
      </DialogActions>
    </Box>
  );
}
