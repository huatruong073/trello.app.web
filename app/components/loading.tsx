import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingSpinnerProps {
  overlay?: boolean;
  message?: string;
}

export function LoadingSpinner({
  overlay = false,
  message,
}: LoadingSpinnerProps = {}) {
  if (overlay) {
    return (
      <div className="flex flex-column align-items-center justify-content-center">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="4"
          fill="transparent"
          animationDuration=".8s"
        />
        {message && <p className="mt-3 text-white font-medium">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
      <ProgressSpinner />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen surface-ground">
      <LoadingSpinner />
      <p className="mt-3 text-color-secondary">Đang tải...</p>
    </div>
  );
}
