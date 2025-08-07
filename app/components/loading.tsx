import { ProgressSpinner } from "primereact/progressspinner";

export function LoadingSpinner() {
  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
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
