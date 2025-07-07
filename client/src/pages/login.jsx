import { useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { login: loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(form);
      loginUser(data);
      alert('Login successful');
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error(err);
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
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 0,
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 320,
          }}>
            <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>Hello!</div>
              <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-1px' }}>Welcome</div>
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
                style={{
                  padding: '10px 12px',
                  border: '1px solid #bbb',
                  borderRadius: 6,
                  fontSize: 15,
                  outline: 'none',
                  marginBottom: 0,
                  width: '100%',
                  height: 40,
                  background: '#c3c9d1',
                  color: '#222',
                  boxSizing: 'border-box',
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
                  style={{
                    padding: '10px 38px 10px 12px',
                    border: '1px solid #bbb',
                    borderRadius: 6,
                    fontSize: 15,
                    outline: 'none',
                    width: '100%',
                    height: 40,
                    background: '#c3c9d1',
                    color: '#222',
                    boxSizing: 'border-box',
                  }}
                  autoComplete="current-password"
                  required
                />
                {/* Toggle password visibility */}
                <span
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#000',
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
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  role="button"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontWeight: 600,
                fontSize: 17,
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#333'}
              onMouseOut={e => e.currentTarget.style.background = '#111'}
            >
              Login
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 15, color: '#111' }}>
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} style={{ color: '#0099ff', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}>
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