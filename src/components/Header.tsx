import { Search, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ModelShare
            </Link>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search models..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user?.username}
                </span>
                <Link to="/upload">
                  <Button>Upload Model</Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/upload">
                  <Button>Upload Model</Button>
                </Link>
              </>
            )}
            <Menu className="h-6 w-6 text-gray-600 cursor-pointer md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}