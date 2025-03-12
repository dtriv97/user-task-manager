import { Add } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  List,
  ListItemButton,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { usersLoadable } from "../../atoms";

export default function UserList() {
  const navigate = useNavigate();
  const usersAtom = useAtomValue(usersLoadable);

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
          Users
        </Typography>
        <IconButton onClick={() => navigate("/add-new-user")}>
          <Add
            sx={{
              color: "#1a1a1a",
              border: "1px solid #1a1a1a",
              borderRadius: "50%",
            }}
          />
        </IconButton>
      </Container>
      {usersAtom.state === "loading" && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {usersAtom.state === "hasData" && (
        <List>
          {usersAtom.data.map((user) => (
            <ListItemButton
              disableTouchRipple
              key={user.userId}
              sx={{
                gap: 2,
                paddingBottom: 1.5,
                paddingTop: 1.5,
                paddingLeft: 2,
              }}
              onClick={() => navigate(`/user/${user.userId}`)}
            >
              <Typography variant="body2">
                {`${user.firstName} ${user.lastName}`}
              </Typography>
            </ListItemButton>
          ))}
          {usersAtom.data.length === 0 && (
            <Typography
              variant="body1"
              sx={{ padding: 2 }}
            >
              No users in the system
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
}
