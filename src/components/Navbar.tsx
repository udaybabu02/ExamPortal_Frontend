import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import armsLogo from "@/assets/arms-logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/instructions" className="flex items-center gap-2">
          <img
            src={armsLogo}
            alt="ARMS Logo"
            className="max-h-[50px] w-auto object-contain drop-shadow-md p-1"
          />
          <span className="hidden sm:inline text-sm font-semibold tracking-tight text-foreground">ARMS Exam Portal</span>
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <User className="h-4 w-4" />
              <span className="max-w-[140px] truncate">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
