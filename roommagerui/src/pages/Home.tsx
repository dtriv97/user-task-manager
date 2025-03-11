import { Typography } from "@mui/material";
import { Card, Container } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h2">Rooms</Typography>
      </Card>
      <Card sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="body1">
          Welcome to the Room Manager. This is a simple app that allows you to
          manage your rooms.
          <br />
          <br />
          Click the rooms on the left to find more details, or add a new room.
          You can also handle users from the panel on the left.
        </Typography>
      </Card>
    </Container>
  );
}
