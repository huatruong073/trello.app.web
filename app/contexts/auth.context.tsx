import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { AuthState, User } from "~/types/auth";
import { authService } from "~/services/auth.service";
import { jwtDecode } from "jwt-decode";

type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { accessToken: string; refreshToken: string; user: User };
    }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | {
      type: "TOKEN_REFRESH_SUCCESS";
      payload: { accessToken: string; refreshToken: string };
    }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "TOKEN_REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Khôi phục session từ localStorage khi app khởi động
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      // Khởi tạo HttpClient với token từ localStorage
      authService.initializeHttpClient();
      const storedAccessToken = authService.getStoredAccessToken();
      const storedRefreshToken = authService.getStoredRefreshToken();
      if (storedAccessToken && storedRefreshToken) {
        try {
          // Thử refresh token để verify tính hợp lệ
          const { Data, Success } =
            await authService.refreshToken(storedRefreshToken);
          authService.storeTokens(Data.AccessToken, Data.RefreshToken);

          // Decode user info từ token hoặc gọi API để lấy thông tin user
          const user: User = jwtDecode(Data.AccessToken) as User;
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              accessToken: Data.AccessToken,
              refreshToken: Data.RefreshToken,
              user,
            },
          });
        } catch (error) {
          // Token không hợp lệ, xóa khỏi storage
          authService.clearStoredTokens();
          dispatch({ type: "LOGIN_FAILURE" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (userName: string, password: string): Promise<void> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const { Data, Success } = await authService.login({
        UserName: userName,
        Password: password,
      });
      if (!Success) {
        throw new Error("Login failed");
      }
      // Store tokens
      authService.storeTokens(Data.AccessToken, Data.RefreshToken);
      const user: User = jwtDecode(Data.AccessToken) as User;
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          accessToken: Data.AccessToken,
          refreshToken: Data.RefreshToken,
          user,
        },
      });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (state.accessToken) {
      await authService.logout();
    }
    authService.clearStoredTokens();
    dispatch({ type: "LOGOUT" });
  };

  const refreshAuthToken = async (): Promise<void> => {
    if (!state.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const { Data, Success } = await authService.refreshToken(
        state.refreshToken
      );
      authService.storeTokens(Data.AccessToken, Data.RefreshToken);

      dispatch({
        type: "TOKEN_REFRESH_SUCCESS",
        payload: {
          accessToken: Data.AccessToken,
          refreshToken: Data.RefreshToken,
        },
      });
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
