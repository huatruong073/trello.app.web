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
    <div className="pages-body login-page flex flex-column">
      <div className="topbar p-3 flex justify-content-between flex-row align-items-center">
        <div className="topbar-left ml-3 flex">
          {/* <div className="logo">
            <img src="assets/layout/images/logo2x.png" alt="" />
          </div> */}
        </div>
        <div className="topbar-right mr-3 flex">
          <Button
            // onClick={goDashboard}
            type="button"
            label="DASHBOARD"
            className="p-button-text p-button-plain topbar-button"
          ></Button>
        </div>
      </div>

      <div className="align-self-center mt-auto mb-auto">
        <div className="pages-panel card flex flex-column">
          <div className="pages-header px-3 py-1">
            <h2>LOGIN</h2>
          </div>

          <h4>Welcome</h4>

          <div className="pages-detail mb-6 px-6">
            Please use the form to sign-in Ultima network
          </div>

          <div className="input-panel flex flex-column px-3">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <span className="p-float-label">
                <InputText type="text" id="inputgroup1" />
                <label htmlFor="inputgroup1">Email</label>
              </span>
            </div>

            <div className="p-inputgroup mt-3 mb-6">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <span className="p-float-label">
                <InputText type="password" id="inputgroup2" />
                <label htmlFor="inputgroup2">Password</label>
              </span>
            </div>
          </div>

          <Button className="login-button mb-6 px-3" label="LOGIN"></Button>
        </div>
      </div>
    </div>
  );
}
