import { PrimeReactProvider } from "primereact/api";

// Tùy chỉnh theme PrimeReact
export const primereactConfig = {
  ripple: true,
  inputStyle: "outlined" as const,
  theme: "lara-light-indigo",
  // Có thể bổ sung thêm các tùy chỉnh khác ở đây
};

// Provider để sử dụng trong root.tsx
export function PrimeConfig({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={primereactConfig}>{children}</PrimeReactProvider>
  );
}
