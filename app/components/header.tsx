import { useAuth } from "~/contexts/auth.context";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import type { MenuItem } from "primereact/menuitem";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const start = <div className="text-xl font-bold mr-2">Trello App</div>;

  const end = (
    <div className="flex align-items-center gap-3">
      <span className="mr-2">Xin chào, {user?.Fullname}</span>
      <Avatar icon="pi pi-user" shape="circle" />
      <Button
        label="Đăng xuất"
        icon="pi pi-sign-out"
        severity="danger"
        onClick={handleLogout}
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar start={start} end={end} className="shadow-1" />
    </div>
  );
}
