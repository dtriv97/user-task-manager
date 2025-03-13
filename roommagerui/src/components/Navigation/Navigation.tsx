import { Box, Drawer, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import RoomList from "./RoomList";
import UserList from "./UserList";

const DRAWER_WIDTH = 240;

export default function Navigation() {
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
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#1a1a1a",
          color: "#f5f5f5",
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            variant="h4"
            sx={{ p: 2 }}
          >
            ResidenceUI
          </Typography>
        </Link>
      </Box>
      <Divider />
      <RoomList />
      <Divider />
      <UserList />
    </Drawer>
  );
}
