import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect nếu đã đăng nhập
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-column border-round-xl min-h-screen bg-gray-100">
      <div className="align-self-center mt-auto mb-auto">
        <div className="pages-panel card flex flex-column shadow-4 px-3 py-5 border-round-md">
          <div className="pages-header px-3 py-1 border-bottom-1 border-300">
            <h2 className="text-primary">LOGIN</h2>
          </div>

          <h3 className="font-medium mt-3 mx-3">Welcome Back</h3>

          <div className="pages-detail mb-4 px-6 text-color-secondary">
            Please sign in to your account to access the Trello App
          </div>

          <form onSubmit={handleSubmit} className="p-fluid">
            <div className="input-panel flex flex-column px-3">
              {error && <div className="p-error mb-3 text-center">{error}</div>}
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-envelope"></i>
                </span>
                <span className="p-float-label">
                  <InputText
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </span>
              </div>

              <div className="p-inputgroup mt-3 mb-4">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <span className="p-float-label">
                  <InputText
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </span>
              </div>
              <Button
                type="submit"
                className="login-button mb-3"
                label="LOGIN"
                icon="pi pi-sign-in"
                loading={loading}
                disabled={loading}
              />
            </div>
            <div className="text-center mt-2 mb-4">
              <span className="text-color-secondary mr-2">
                Don't have an account?
              </span>
              <a href="#" className="font-medium text-primary">
                Register
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto py-3 text-center text-color-secondary">
        <span>© 2025 Trello App - All Rights Reserved</span>
      </div>
    </div>
  );
}
