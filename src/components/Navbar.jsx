import { useState } from 'react';
import logo from '../assets/researchpath-logo.svg'
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfileMenu } from './floating/ProfileMenu';
import { CommandPalette } from './floating/CommandPalette';
import { BookOpen, Search, Menu, X, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  if (isAuthPage) return null;

  const navLinks = currentUser ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Papers', path: '/papers' },
    { name: 'Upload', path: '/upload' },
    { name: 'Journals', path: '/journals' },
    { name: 'Resources', path: '/resources' },
  ] : [
    { name: 'Features', path: '/#features', isExternal: true },
    { name: 'Journals', path: '/journals' },
  ];

  return (
    <>
      <nav className="nav-pill">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-heading font-extrabold text-slate-800 group">

          <img src={logo} width={45} height={45} alt="ResearchPath" />

          <span className="hidden sm:inline">Research<span className="text-primary">Path</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            link.isExternal ? (
              <a key={link.name} href={link.path} className={`nav-link-premium ${location.pathname === link.path ? 'active' : ''}`}>
                {link.name}
              </a>
            ) : (
              <Link key={link.name} to={link.path} className={`nav-link-premium ${location.pathname === link.path ? 'active' : ''}`}>
                {link.name}
              </Link>
            )
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          <button
            onClick={() => setCmdOpen(true)}
            className="p-2.5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary/20 rounded-xl text-slate-400 hover:text-primary transition-all duration-300 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 ml-1">
              <button onClick={() => setCmdOpen(true)} className="p-2.5 bg-[#fcf8ff] text-primary hover:bg-white border border-primary/10 rounded-xl transition-all hover:rotate-6">
                <Sparkles className="w-5 h-5" />
              </button>
              <ProfileMenu />
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-7 !py-2.5 text-sm font-bold tracking-wide ml-2">Sign In</Link>
          )}
        </div>

        <button className="md:hidden text-slate-500 hover:text-primary p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <CommandPalette isOpen={cmdOpen} setIsOpen={setCmdOpen} />
    </>
  );
};
