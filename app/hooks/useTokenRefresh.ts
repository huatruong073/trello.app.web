import { useEffect } from "react";
import { useAuth } from "~/contexts/auth.context";

const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export function useTokenRefresh() {
  const { refreshAuthToken, isAuthenticated, accessToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        await refreshAuthToken();
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Auth context will handle logout on failure
      }
    }, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, refreshAuthToken]);
}
