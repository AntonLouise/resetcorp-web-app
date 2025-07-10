import { useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { login: loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Connecting to server...', {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    try {
      const data = await login(form);
      loginUser(data);
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: "Login successful! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      // Update loading toast to error
      toast.update(loadingToast, {
        render: err.response?.data?.message || 'Login failed. Please try again.',
        type: "error",
        isLoading: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setError(err.response?.data?.message || 'Login failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #b2f0e6 0%, #d0f7c6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      flexDirection: 'column',
    }}>
      <div className="login-split-card" style={{
        width: '92vw',
        maxWidth: 800,
        minHeight: 420,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}>
        {/* Left side: Illustration and Welcome */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: 'linear-gradient(135deg, #0fd850 0%, #00f2fe 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          padding: '40px',
          overflow: 'hidden',
        }}>
          {/* Geometric shapes for modern design */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.25)',
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'rotate(45deg)',
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.3)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}></div>
          
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '40px',
            width: '20px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.18)',
            borderRadius: '10px',
            transform: 'rotate(-15deg)',
          }}></div>
          
          <div style={{
            position: 'relative',
            zIndex: 2,
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: 12, lineHeight: 1.2 }}>
              Welcome to<br />
              <span style={{ color: '#000', fontSize: '2.2rem' }}>RESET Corp.</span>
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: 400, 
              opacity: 0.95,
              lineHeight: 1.4,
              maxWidth: '280px',
            }}>
              Powering sustainable futures with clean, portable solar energy
            </div>
          </div>
        </div>

        {/* Right side: Login form */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
        }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.5rem', marginBottom: 12, color: '#111' }}>Login</h2>
            {location.state?.redirected && (
              <p style={{ color: '#0099ff', textAlign: 'center', margin: 0, marginBottom: 8 }}>
                Please log in to access that page.
              </p>
            )}
            {error && <p style={{ color: 'red', textAlign: 'center', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label htmlFor="email" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2, color: '#111' }}>Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={isLoading}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #bbb',
                  borderRadius: 6,
                  fontSize: 15,
                  outline: 'none',
                  marginBottom: 0,
                  width: '100%',
                  height: 40,
                  background: isLoading ? '#f0f0f0' : '#c3c9d1',
                  color: '#222',
                  boxSizing: 'border-box',
                  cursor: isLoading ? 'not-allowed' : 'text',
                }}
                autoComplete="email"
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="password" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2, color: '#111' }}>Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  disabled={isLoading}
                  style={{
                    padding: '10px 38px 10px 12px',
                    border: '1px solid #bbb',
                    borderRadius: 6,
                    fontSize: 15,
                    outline: 'none',
                    width: '100%',
                    height: 40,
                    background: isLoading ? '#f0f0f0' : '#c3c9d1',
                    color: '#222',
                    boxSizing: 'border-box',
                    cursor: isLoading ? 'not-allowed' : 'text',
                  }}
                  autoComplete="current-password"
                  required
                />
                {/* Toggle password visibility */}
                <span
                  onClick={() => !isLoading && setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: isLoading ? '#ccc' : '#000',
                    fontSize: 22,
                    userSelect: 'none',
                    fontFamily: 'Material Icons',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    lineHeight: 1,
                    letterSpacing: 'normal',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    wordWrap: 'normal',
                    direction: 'ltr',
                    WebkitFontFeatureSettings: '"liga"',
                    WebkitFontSmoothing: 'antialiased',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={isLoading ? -1 : 0}
                  role="button"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#666' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontWeight: 600,
                fontSize: 17,
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.18s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={e => !isLoading && (e.currentTarget.style.background = '#333')}
              onMouseOut={e => !isLoading && (e.currentTarget.style.background = '#111')}
            >
              {isLoading && (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
              )}
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 15, color: '#111' }}>
              Don't have an account?{' '}
              <span 
                onClick={() => !isLoading && navigate('/register')} 
                style={{ 
                  color: isLoading ? '#ccc' : '#0099ff', 
                  textDecoration: 'underline', 
                  fontWeight: 500, 
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                Create free account?
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Back to Home link at lower left of the card */}
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, bottom: -36 }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none', fontWeight: 400, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
        
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 800px) {
          .login-split-card {
            flex-direction: column !important;
            width: 96vw !important;
            max-width: 96vw !important;
            min-height: auto !important;
            border-radius: 12px !important;
          }
          .login-split-card > div {
            width: 100% !important;
            padding: 28px 6vw !important;
          }
          .login-split-card > div:first-child {
            padding: 20px 6vw !important;
          }
        }

        @media (max-width: 480px) {
          .login-split-card > div {
            padding: 20px 4vw !important;
          }

          form h2 {
            font-size: 1.25rem !important;
          }

          form button {
            font-size: 1rem !important;
          }
        }

        @media (max-width: 600px) {
          .login-split-card {
            flex-direction: column !important;
            width: 90vw !important;
            max-width: 340px !important;
            min-height: 320px !important;
            border-radius: 8px !important;
          }
          .login-split-card > div {
            width: 100% !important;
            padding: 10px 0 !important;
          }
          .login-split-card > div:first-child {
            padding: 15px 4vw !important;
          }
          .login-split-card form {
            gap: 10px !important;
            padding: 0 2vw !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .login-split-card form h2 {
            font-size: 1.1rem !important;
            margin-bottom: 8px !important;
          }
          .login-split-card form button,
          .login-split-card form input[type="email"],
          .login-split-card form input[type="password"] {
            max-width: 95% !important;
            margin: 0 auto 0 auto !important;
            display: block !important;
          }
          .login-split-card form button {
            font-size: 0.95rem !important;
            padding: 8px 0 !important;
            border-radius: 7px !important;
          }
          .login-split-card form input[type="email"],
          .login-split-card form input[type="password"] {
            font-size: 0.95rem !important;
            padding: 7px 10px !important;
            height: 32px !important;
          }
          label {
            font-size: 0.85rem !important;
          }
          .material-symbols-outlined {
            font-size: 1.1rem !important;
          }
          .login-split-card > div > div {
            min-height: 100px !important;
          }
          .login-split-card > div > div > div {
            font-size: 1.1rem !important;
          }
          .login-split-card > div > div > div + div {
            font-size: 1.5rem !important;
          }
          .login-split-card form div {
            gap: 5px !important;
          }
          .login-split-card form > div[style*="textAlign: center"] {
            font-size: 0.9rem !important;
            margin-top: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;