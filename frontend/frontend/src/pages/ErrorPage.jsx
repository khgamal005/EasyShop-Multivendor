import { Button, Container } from "@mui/material";
import { useRouteError, useNavigate } from "react-router-dom";


const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <Container>
      <div className="notFound">
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>

        <Button variant="link" onClick={() => navigate("/", { replace: true })}>
          Go Back
        </Button>
      </div>
    </Container>
  );
};

export default ErrorPage;
