import { ProtectedRoute } from "~/components/protected-route";
import { Header } from "~/components/header";
import { BoardsList } from "~/components/boards-list";
import { useTokenRefresh } from "~/hooks/useTokenRefresh";

export default function Dashboard() {
  // Automatically refresh token every 15 minutes
  useTokenRefresh();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <BoardsList />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
