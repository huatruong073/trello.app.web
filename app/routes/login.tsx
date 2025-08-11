import { FORM_ERROR } from "final-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth.context";

interface LoginFormValues {
  email: string;
  password: string;
}

// Validation functions
const validateEmail = (value: string) => {
  if (!value) {
    return "Email là bắt buộc";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Email không hợp lệ";
  }

  return undefined;
};

const validatePassword = (value: string) => {
  if (!value) {
    return "Mật khẩu là bắt buộc";
  }

  if (value.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }

  return undefined;
};

// Form-level validation
const validate = (values: LoginFormValues) => {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export default function Login() {
  const [error, setError] = useState("");

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect nếu đã đăng nhập
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
      return {
        [FORM_ERROR]: err instanceof Error ? err.message : "Đăng nhập thất bại",
      };
    }
  };

  const isFormFieldValid = (meta: any) => !!(meta.touched && meta.error);

  const getFormErrorMessage = (meta: any) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  return (
    <div className="flex flex-column border-round-xl min-h-screen bg-gray-100 relative">
      <div className="align-self-center mt-auto mb-auto">
        <div className="pages-panel card flex flex-column shadow-4 px-3 py-3 border-round-md">
          <div className="pages-header px-3 py-1 border-bottom-1 border-300">
            <h2 className="text-primary">LOGIN</h2>
          </div>

          <h3 className="font-medium mt-3 mx-3">Welcome Back</h3>

          <div className="pages-detail mb-4 px-6 text-color-secondary">
            Please sign in to your account to access the Trello App
          </div>

          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting, submitError }) => (
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="input-panel flex flex-column px-3 gap-3">
                  {error && (
                    <div className="p-error mb-3 text-center">{error}</div>
                  )}
                  {submitError && (
                    <div className="p-error mb-3 text-center">
                      {submitError}
                    </div>
                  )}

                  <Field
                    name="email"
                    validate={validateEmail}
                    render={({ input, meta }) => (
                      <div className="p-field">
                        <span className="p-float-label p-input-icon-left">
                          <i className="pi pi-envelope" />
                          <InputText
                            id="email"
                            {...input}
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="email"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Email*
                          </label>
                        </span>
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  />

                  <Field name="password" validate={validatePassword}>
                    {({ input, meta }) => (
                      <div className="p-field">
                        <span className="p-float-label p-input-icon-left">
                          <i className="pi pi-lock" />
                          <InputText
                            id="password"
                            type="password"
                            {...input}
                            className={classNames({
                              "p-invalid": isFormFieldValid(meta),
                            })}
                          />
                          <label
                            htmlFor="password"
                            className={classNames({
                              "p-error": isFormFieldValid(meta),
                            })}
                          >
                            Password*
                          </label>
                        </span>
                        {getFormErrorMessage(meta)}
                      </div>
                    )}
                  </Field>

                  <Button
                    type="submit"
                    className="login-button mb-3"
                    label="LOGIN"
                    icon="pi pi-sign-in"
                    loading={isLoading || submitting}
                    disabled={isLoading || submitting}
                  />
                </div>
                <div className="text-center mt-2 mb-4">
                  <span className="text-color-secondary mr-2">
                    Don't have an account?
                  </span>
                  <a
                    className={`font-medium cursor-pointer text-primary ${isLoading ? " pointer-events-none opacity-60" : ""}`}
                    aria-disabled={isLoading}
                    onClick={(e) => {
                      if (isLoading) e.preventDefault();
                      navigate("/register");
                    }}
                  >
                    Register
                  </a>
                </div>
              </form>
            )}
          />
        </div>
      </div>
      <div className="mt-auto py-3 text-center text-color-secondary">
        <span>© 2025 Trello App - All Rights Reserved</span>
      </div>
    </div>
  );
}
