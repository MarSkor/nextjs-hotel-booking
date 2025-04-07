import { Container, Button, Group } from "@mantine/core";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <Container className="notfound">
      <div className="notfound__label">404</div>
      <h1 className="notfound__title">You have found a secret place.</h1>
      <p className="notfound__description">
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </p>

      <Group justify="center">
        <Button variant="subtle" size="md" component={Link} href="/">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
};

export default NotFoundPage;
