import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Network, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
        active
          ? 'text-[var(--accent-glow)] bg-[var(--accent-glow)]/10'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highest)]'
      }`}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: 'rgba(7,15,34,0.85)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, rgba(59,191,250,0.2) 0%, rgba(167,139,250,0.15) 100%)', border: '1px solid rgba(59,191,250,0.25)' }}>
              <Network className="w-5 h-5 text-[var(--accent-glow)]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
              IP <span className="text-[var(--accent-glow)]">Navigator</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/tools">Tools</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/reports">Reports</NavLink>
                <NavLink to="/history">History</NavLink>
                <NavLink to="/profile">Profile</NavLink>
              </>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-[var(--text-secondary)] px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--surface-highest)', border: '1px solid var(--border-color)' }}>
                  👋 {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary !py-1.5 !px-3 flex items-center gap-1.5 text-xs">
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary !py-2 !px-4 flex items-center gap-1.5 text-sm">
                  <User className="w-3.5 h-3.5" /> Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-highest)] transition-colors"
            onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-1"
          style={{ borderColor: 'var(--border-color)', background: 'rgba(7,15,34,0.97)' }}>
          {['/tools', ...(user ? ['/dashboard', '/reports', '/history', '/profile'] : [])].map(path => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-highest)] transition-all">
              {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              <ChevronRight className="w-4 h-4 opacity-40" />
            </Link>
          ))}
          <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            {user ? (
              <button onClick={handleLogout} className="w-full btn-secondary flex items-center justify-center gap-2 text-sm">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-secondary text-center text-sm">Log in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-center text-sm">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
