import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminUserForm = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then((data) => {
        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load user.');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await updateUser(id, user);
      console.log('User updated successfully, showing toast...');
      toast.success('User updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Add a small delay to ensure toast is displayed before navigation
      setTimeout(() => {
        navigate('/admin/users');
      }, 500);
    } catch (err) {
      const errorMessage = 'Failed to update user.';
      setError(errorMessage);
      console.log('User update failed, showing error toast...');
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #28a745',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }}></div>
      <p style={{
        color: '#6c757d',
        fontSize: '1.1rem',
        margin: 0,
        fontWeight: '500'
      }}>Loading user details...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Optionally, mock user ID and joined date for visual
  const userId = id ? id.slice(-8) : '--------';
  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      minHeight: '100vh',
      width: '100vw',
      background: '#fff',
      zIndex: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              disabled={submitting}
              style={{
                ...styles.nameInput,
                background: submitting ? '#f0f0f0' : '#ffffff',
                cursor: submitting ? 'not-allowed' : 'text'
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              disabled={submitting}
              style={{
                ...styles.emailInput,
                background: submitting ? '#f0f0f0' : '#ffffff',
                cursor: submitting ? 'not-allowed' : 'text'
              }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleDropdownWrap}>
              <span style={{...styles.roleIcon, color: '#fff'}} className="material-symbols-outlined">{user.role === 'admin' ? 'admin_panel_settings' : 'person'}</span>
              <select 
                name="role" 
                value={user.role} 
                onChange={handleInputChange} 
                disabled={submitting}
                style={{
                  ...styles.roleDropdown,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={styles.extraInfoRow}>
            <div style={styles.extraInfo}><span style={styles.extraLabel}>User ID:</span> <span style={styles.extraValue}>{userId}</span></div>
            <div style={styles.extraInfo}><span style={styles.extraLabel}>Joined:</span> <span style={styles.extraValue}>{joined}</span></div>
          </div>
          <div style={styles.buttonRow}>
            <button 
              type="submit" 
              style={{
                ...styles.updateButton,
                background: submitting ? '#666' : '#111',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></div>
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
            <button 
              type="button" 
              style={styles.cancelButton} 
              onClick={() => navigate('/admin/users')}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
        
        {/* Loading Overlay */}
        {submitting && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingContent}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Updating user information...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    maxWidth: '400px',
    margin: '2.5rem auto',
    padding: '2.5rem 2rem 2rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    width: '100%',
  },
  label: {
    fontSize: '0.95rem',
    color: '#6c757d',
    fontWeight: 500,
    marginBottom: '0.1rem',
    textAlign: 'center',
    width: '100%',
  },
  nameInput: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#2c3e50',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    background: '#ffffff',
    padding: '0.7rem 1rem',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  emailInput: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    background: '#ffffff',
    padding: '0.7rem 1rem',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  roleDropdownWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#22c55e',
    borderRadius: '999px',
    padding: '0.18rem 1.1rem',
    gap: '0.4rem',
    width: 'fit-content',
    marginTop: '0.2rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
  },
  roleIcon: {
    fontSize: '1.1rem',
    marginRight: '0.2rem',
    color: '#fff',
  },
  roleDropdown: {
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    outline: 'none',
    padding: '0.2rem 0.5rem',
    borderRadius: '999px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
  },
  extraInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1.5rem',
    margin: '0.5rem 0 0.2rem 0',
  },
  extraInfo: {
    display: 'flex',
    gap: '0.3rem',
    fontSize: '0.93rem',
    color: '#6c757d',
    alignItems: 'center',
  },
  extraLabel: {
    fontWeight: 500,
    color: '#6c757d',
  },
  extraValue: {
    fontWeight: 600,
    color: '#2c3e50',
    fontSize: '0.97rem',
  },
  buttonRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end',
  },
  updateButton: {
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 2.2rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background 0.2s',
  },
  cancelButton: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 1.7rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background 0.2s',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e8f5e8',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#28a745',
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: 0,
  },
};

/* Add custom styles for the select dropdown options */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  select[name="role"] option {
    color: #222;
    background: #fff;
  }
  select[name="role"] option:checked, select[name="role"] option:focus, select[name="role"] option:hover {
    background: #22c55e !important;
    color: #fff !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminUserForm; 