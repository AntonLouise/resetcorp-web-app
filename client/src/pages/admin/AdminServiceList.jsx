import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import { getValidMaterialIcon, MaterialIcon } from '../../components/IconPicker';

const headerStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    margin: 0,
    fontWeight: 700,
    fontSize: '2rem',
    color: '#222',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6c757d',
    marginTop: 2,
    fontWeight: 400,
    textAlign: 'left',
  },
  addButton: {
    background: '#28a745',
    color: '#fff',
    padding: '0.7rem 1.6rem',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    fontSize: '1.1rem',
    boxShadow: '0 4px 16px rgba(40,167,69,0.10)',
    letterSpacing: '0.5px',
    border: 'none',
    transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
  },
};

// Helper: fallback to default icon if not a valid Material Symbol, with mapping for custom names
const getMaterialIcon = (icon) => getValidMaterialIcon(icon);
// (getValidMaterialIcon now uses 'build' as fallback)

const AdminServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [location]);

  // Show toast for all errors
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 5000 });
    }
  }, [error]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (serviceId) => {
    setDeleteId(serviceId);
    setConfirmOpen(true);
  };
  const confirmDelete = async () => {
    setConfirmLoading(true);
    try {
      // TODO: get admin token from context or storage
      const token = localStorage.getItem('token');
      await serviceService.deleteService(deleteId, token);
      toast.success('Service deleted successfully!', { position: 'top-right', autoClose: 3000 });
      fetchServices();
    } catch (err) {
      setError('Failed to delete service.');
      toast.error('Failed to delete service.', { position: 'top-right', autoClose: 5000 });
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="admin-spinner" />
        <div style={{ marginTop: 16, color: '#6c757d', fontSize: '1.1rem' }}>Loading services...</div>
      </div>
    );
  }
  // Remove inline error, use toast instead

  // Inject hover effect styles for services
  if (typeof document !== 'undefined' && !document.getElementById('admin-service-list-hover-effects')) {
    const style = document.createElement('style');
    style.id = 'admin-service-list-hover-effects';
    style.textContent = `
      .admin-service-card {
        transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
        box-shadow: 0 2px 10px rgba(0,0,0,0.07);
        border-radius: 16px;
        background: #fff;
        padding: 1.5rem;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        min-height: 220px;
        position: relative;
      }
      .admin-service-card:hover {
        box-shadow: 0 8px 32px rgba(40,167,69,0.13);
        transform: translateY(-6px) scale(1.01);
        z-index: 2;
      }
      .admin-edit-button, .admin-delete-button, .admin-add-button, .admin-empty-btn {
        transition: background 0.2s, color 0.2s, transform 0.2s;
        border-radius: 8px !important;
        font-size: 1rem;
        padding: 0.45rem 1.1rem !important;
        font-weight: 500;
      }
      .admin-edit-button {
        background: #f8f9fa;
        color: #222;
        border: none;
      }
      .admin-edit-button:hover {
        transform: scale(1.02) !important;
        background: #28a745 !important;
        color: white !important;
      } 
      .admin-delete-button {
        background: #f8f9fa;
        color: #dc3545;
        border: none;
      }
      .admin-delete-button:hover {
        transform: scale(1.02);
        background: #dc3545 !important;
        color: #fff !important;
      }
      .admin-add-button {
        background: #28a745;
        color: #fff;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        padding: 0.7rem 1.6rem;
        box-shadow: 0 4px 16px rgba(40,167,69,0.10);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }
      .admin-add-button:hover {
        background: #218838 !important;
        color: #fff !important;
        box-shadow: 0 8px 24px rgba(40,167,69,0.18);
        transform: translateY(-2px) scale(1.04);
      }
      .admin-back-button {
        background: #f8f9fa;
        color: #495057;
        border: none;
        border-radius: 8px;
        padding: 0.4rem 1rem;
        font-size: 1.1rem;
        margin-right: 1rem;
        transition: background 0.2s, color 0.2s, transform 0.2s;
      }
      .admin-back-button:hover {
        transform: scale(1.1);
        background: rgba(108, 117, 125, 0.1) !important;
        color: #28a745 !important;
      }
      .admin-service-list-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      @media (max-width: 700px) {
        .admin-service-list-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .admin-service-card {
          padding: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // CSS spinner styles (inject if not present)
  if (typeof document !== 'undefined' && !document.getElementById('admin-service-spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'admin-service-spinner-styles';
    style.textContent = `
      .admin-spinner {
        display: block;
        margin: 60px auto;
        width: 60px;
        height: 60px;
        border: 6px solid #e0e0e0;
        border-top: 6px solid #28a745;
        border-radius: 50%;
        animation: admin-spin 1s linear infinite;
      }
      @keyframes admin-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '2rem' }}>
      {/* Centered Header and Subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
        <button onClick={() => { navigate('/admin'); window.scrollTo(0, 0); }} className="admin-back-button" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#222', textAlign: 'center' }}>Service Management</h1>
        <div style={{ fontSize: '1rem', color: '#6c757d', marginTop: 4, fontWeight: 400, textAlign: 'center', marginBottom: '1.5rem' }}>
          Manage all services offered on the platform
        </div>
      </div>
      {/* Add Button Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/admin/services/new" style={{ background: '#28a745', color: '#fff', padding: '0.7rem 1.6rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', boxShadow: '0 4px 16px rgba(40,167,69,0.10)', letterSpacing: '0.5px', border: 'none', transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s', marginBottom: 0 }} className="admin-add-button">
          <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: 4, color: '#fff' }}>add</span>
          Add New Service
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }} className="admin-service-list-grid">
        {services.map(service => (
          <div key={service._id} className="admin-service-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', minHeight: 220 }}>
            <MaterialIcon 
              icon={service.icon} 
              style={{ fontSize: '2.8rem', color: '#28a745', background: '#e0fbe8', borderRadius: '50%', padding: 16, marginBottom: 16, marginTop: 8 }}
              fallback="⚙️"
            />
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.2rem', color: '#222', marginBottom: 8 }}>{service.name || service.title}</h3>
            <p style={{ color: '#6c757d', margin: 0, fontSize: '0.98rem', fontWeight: 400, marginBottom: 16 }}>{service.description}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <Link to={`edit/${service._id}`} className="admin-edit-button">
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: 2 }}>edit</span>
                Edit
              </Link>
              <button onClick={() => handleDelete(service._id)} className="admin-delete-button">
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: 2 }}>delete</span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={confirmOpen}
        loading={confirmLoading}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
      />
    </div>
  );
};

export default AdminServiceList; 