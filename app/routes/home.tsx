import { Navigate } from "react-router";
import { useAuth } from "~/contexts/auth.context";
import { LoadingPage } from "~/components/loading";

export function meta() {
  return [
    { title: "Trello App" },
    { name: "description", content: "Welcome to Trello App!" },
  ];
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  // Redirect to dashboard if authenticated, login if not
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
