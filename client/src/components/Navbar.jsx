import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Add Material Icons font import for SSR/CSR
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const scrollToSection = (sectionId) => {
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 64; // Height of the fixed navbar
      const sectionTop = section.offsetTop - navbarHeight;
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  }, 100); // Delay to ensure DOM is rendered
};

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const [pendingScroll, setPendingScroll] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const scrollListenerRef = useRef(null);

  // Handle scroll after navigation to home
  useEffect(() => {
    if (pendingScroll && location.pathname === '/') {
      scrollToSection(pendingScroll);
      setPendingScroll(null);
    }
  }, [location, pendingScroll]);

  // Scroll spy effect for homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        scrollListenerRef.current = null;
      }
      return;
    }
    function onScroll() {
      const home = document.getElementById('home');
      const services = document.getElementById('services');
      const about = document.getElementById('about');
      const scrollY = window.scrollY || window.pageYOffset;
      const buffer = 80; // px offset for navbar height
      if (home && services && about) {
        const homeTop = home.offsetTop - buffer;
        const servicesTop = services.offsetTop - buffer;
        const aboutTop = about.offsetTop - buffer;
        const aboutBottom = aboutTop + about.offsetHeight;
        if (scrollY >= aboutTop) {
          setActiveSection('about');
        } else if (scrollY >= servicesTop) {
          setActiveSection('services');
        } else {
          setActiveSection('home');
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    scrollListenerRef.current = onScroll;
    onScroll();
    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        scrollListenerRef.current = null;
      }
    };
  }, [location.pathname]);

  const handleRoute = (route) => {
    setDrawerOpen(false);
    navigate(route);
    // Scroll to top when navigating to a new page with a slight delay to ensure the page has loaded
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  const handleScrollNav = (sectionId) => {
    setDrawerOpen(false);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      setPendingScroll(sectionId);
      navigate('/');
    }
  };

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: '#fff', color: '#222', zIndex: 1000, borderBottom: '1px solid #ddd', height: 64, minHeight: 64, maxHeight: 64, boxShadow: '0 2px 8px rgba(40,167,69,0.13)', overflow: 'hidden' }}>
      {/* Desktop/Tablet Navbar */}
      <div className="navbar-desktop" style={{ display: 'flex', height: 64, minHeight: 64, maxHeight: 64, width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 64,
          minHeight: 64,
          maxHeight: 64,
          position: 'relative',
        }}>
          {/* Left links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-start', height: 64 }}>
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'home') ? ' active' : ''}`} onClick={() => handleScrollNav('home')}>Home</button>
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'services') ? ' active' : ''}`} onClick={() => handleScrollNav('services')}>Services</button>
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'about') ? ' active' : ''}`} onClick={() => handleScrollNav('about')}>About Us</button>
            <button className={`nav-link${location.pathname === '/products' ? ' active' : ''}`} onClick={() => handleRoute('/products')}>Products</button>
          </div>
          {/* Centered brand/logo */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, minHeight: 64, maxHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: 1, background: '#fff', padding: '0 1rem', pointerEvents: 'auto', height: 64, display: 'flex', alignItems: 'center' }}>RESET CORP.</span>
          </div>
          {/* Right links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end', height: 64 }}>
            <button className={`nav-link${location.pathname === '/contact' ? ' active' : ''}`} onClick={() => handleRoute('/contact')}>Contacts</button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button className={`nav-link${location.pathname === '/admin' ? ' active' : ''}`} onClick={() => handleRoute('/admin')}>Dashboard</button>
                )}
                <button className={`nav-link${location.pathname === '/profile' ? ' active' : ''}`} onClick={() => handleRoute('/profile')}>Profile</button>
                <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80, height: 40 }}>Logout</button>
              </>
            ) : (
              <button onClick={() => handleRoute('/login')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80, height: 40 }}>Login</button>
            )}
            <button onClick={() => handleRoute('/cart')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.5rem', position: 'relative', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', verticalAlign: 'middle' }}>shopping_cart</span>
              {user && cartItemCount > 0 && (
                <span style={{ marginLeft: 4, fontSize: '1rem', color: '#222', fontWeight: 600 }}>
                  ({cartItemCount})
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="navbar-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', height: 64, minHeight: 64, maxHeight: 64, width: '100%' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', height: 64, display: 'flex', alignItems: 'center' }}>RESET CORP.</span>
        <button
          aria-label="Open navigation menu"
          onClick={() => setDrawerOpen(true)}
          style={{ background: 'none', border: 'none', color: '#222', fontSize: '2rem', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '2rem', verticalAlign: 'middle' }}>menu</span>
        </button>
      </div>
      {/* Side Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: drawerOpen ? 0 : '-80vw',
          width: '80vw',
          maxWidth: 320,
          height: '100vh',
          background: '#fff',
          color: '#222',
          transition: 'left 0.3s',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '2rem',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <button
          aria-label="Close navigation menu"
          onClick={() => setDrawerOpen(false)}
          style={{ alignSelf: 'flex-end', marginRight: '1.5rem', background: 'none', border: 'none', color: '#222', fontSize: '2rem', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>close</span>
        </button>
        <button onClick={() => handleScrollNav('home')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Home</button>
        <button onClick={() => handleRoute('/products')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Products</button>
        <button onClick={() => handleScrollNav('services')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Services</button>
        <button onClick={() => handleScrollNav('about')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>About Us</button>
        <button onClick={() => handleRoute('/contact')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Contacts</button>
        <button onClick={() => handleRoute('/cart')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Cart</button>
        {user ? (
          <>
            {user.role === 'admin' && (
              <button onClick={() => handleRoute('/admin')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Dashboard</button>
            )}
            <button onClick={() => handleRoute('/profile')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Profile</button>
            <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.7rem 2rem', fontWeight: 500, margin: '0 2rem 1rem 2rem', cursor: 'pointer', fontSize: '1.1rem', width: 'calc(100% - 4rem)' }}>Logout</button>
          </>
        ) : (
          <button onClick={() => handleRoute('/login')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.7rem 2rem', fontWeight: 500, margin: '1rem 2rem', cursor: 'pointer', fontSize: '1.1rem', width: 'calc(100% - 4rem)' }}>Login</button>
        )}
      </div>
      {/* Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1500,
          }}
        />
      )}
      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1500px) {
          .navbar-desktop { display: flex !important; }
          .navbar-mobile { display: none !important; }
        }
        @media (max-width: 1499px) {
          .navbar-desktop { display: none !important; }
          .navbar-mobile { display: flex !important; }
        }
        @media (min-width: 900px) and (max-width: 1499px) {
          .navbar-desktop .nav-link {
            gap: 1rem !important;
            font-size: 0.95rem !important;
            padding: 0.5rem 0.7rem 0.3rem 0.7rem !important;
            min-width: 60px !important;
          }
          .navbar-desktop .nav-link:not(:last-child) {
            margin-right: 16px !important;
          }
        }
        .nav-link {
          position: relative;
          background: none;
          border: none;
          color: #222;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 1.2rem 0.3rem 1.2rem;
          font-size: 1rem;
          min-width: 80px;
          outline: none;
          transition: color 0.18s;
          text-align: center;
          text-decoration: none;
        }
        .nav-link:hover, .nav-link.active {
          color: #28a745;
        }
        .nav-link::before {
          content: '';
          display: block;
          position: absolute;
          left: 20%;
          right: 20%;
          top: 0;
          height: 3px;
          border-radius: 2px;
          background: transparent;
          transition: background 0.18s;
        }
        .nav-link:hover::before, .nav-link.active::before {
          background: #28a745;
        }
        .nav-link:not(:last-child) {
          margin-right: 30px;
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined', sans-serif;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 1.6rem;
          vertical-align: middle;
          color: #222;
          transition: color 0.18s;
        }
        .nav-link:active, .nav-link:focus {
          outline: none;
        }
        nav, .navbar-desktop, .navbar-mobile {
          box-shadow: 0 2px 8px rgba(40,167,69,0.13) !important;
        }
        .navbar-desktop {
          background: #fff !important;
        }
        .navbar-mobile {
          background: #fff !important;
        }
        /* Drawer/side menu (if you want green highlights) */
        .navbar-mobile button:focus,
        .navbar-mobile button:hover {
          color: #28a745 !important;
        }
        @media (max-width: 600px) {
          nav {
            background: #fff !important;
            box-shadow: 0 1px 3px rgba(40,167,69,0.10) !important;
            border-bottom: 1px solid #e0e0e0 !important;
          }
          nav, .navbar-desktop, .navbar-mobile {
            min-height: 64px !important;
            height: 64px !important;
          }
          .navbar-desktop > div,
          .navbar-mobile {
            min-height: 64px !important;
            height: 64px !important;
          }
          .nav-link {
            font-size: 0.85rem !important;
            padding: 0.2rem 0.7rem !important;
          }
          .navbar-mobile {
            padding: 0 0.5rem !important;
          }
          .navbar-mobile span[style*='fontWeight: bold'] {
            margin-right: 0.2rem !important;
          }
          .navbar-desktop span[style*='fontWeight: bold'] {
            font-size: 1rem !important;
          }
          .navbar-desktop button,
          .navbar-mobile button {
            min-width: 32px !important;
            height: 32px !important;
            font-size: 0.95rem !important;
            padding: 0.2rem 0.7rem !important;
          }
          .material-symbols-outlined {
            font-size: 1.1rem !important;
          }
          /* Keep menu icon large on all screens */
          .navbar-mobile button[aria-label="Open navigation menu"] .material-symbols-outlined {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 