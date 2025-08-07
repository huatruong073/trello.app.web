import { ProtectedRoute } from "~/components/protected-route";
import { Header } from "~/components/header";
import { BoardsList } from "~/components/boards-list";
import { useTokenRefresh } from "~/hooks/useTokenRefresh";

export default function Dashboard() {
  // Automatically refresh token every 15 minutes
  useTokenRefresh();

  return (
    <ProtectedRoute>
      <div className="min-h-screen surface-ground">
        <Header />
        <main className="max-w-7xl mx-auto py-6 px-3 md:px-6">
          <div className="p-4">
            <BoardsList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
