import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash, FaSolarPanel, FaCogs, FaFlask, FaCheck, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { serviceService } from '../../services/serviceService';
import { toast } from 'react-toastify';
import IconPicker, { getValidMaterialIcon, MaterialIcon } from '../../components/IconPicker';

const AdminServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    icon: 'build',
    isActive: true,
    whyChoose: [''],
    ctaText: '',
    ctaButtonText: 'Contact Us'
  });

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  useEffect(() => {
    if (!document.getElementById('service-form-styles')) {
      const style = document.createElement('style');
      style.id = 'service-form-styles';
      style.textContent = `
        .service-form-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: block;
          padding: 2rem 0 2rem 2rem;
        }
        .service-form-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(40,167,69,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          max-width: 380px;
          width: 100%;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          margin-top: 2rem;
          margin-left: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        @media (max-width: 600px) {
          .service-form-bg {
            padding: 1rem 0 1rem 0.5rem;
          }
          .service-form-card {
            max-width: 98vw;
            padding: 1rem 0.5rem;
            margin-top: 1rem;
          }
        }
        .service-form-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.2rem;
        }
        .service-form-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #222;
          margin: 0;
        }
        .service-form-btn-cancel {
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 0.45rem 1.2rem;
          font-weight: 600;
          font-size: 0.98rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .service-form-btn-cancel:hover {
          background: #b52a37;
        }
        .service-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          width: 100%;
        }
        .service-form-label {
          font-size: 0.93rem;
          color: #6c757d;
          font-weight: 500;
          margin-bottom: 0.1rem;
        }
        .service-form-input, .service-form-textarea, .service-form-select {
          font-size: 0.98rem;
          color: #2c3e50;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #f8f9fa;
          padding: 0.6rem 0.9rem;
          outline: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          margin-bottom: 0.2rem;
        }
        .service-form-input:focus, .service-form-textarea:focus, .service-form-select:focus {
          border-color: #28a745;
          background: #fff;
        }
        .service-form-btn {
          background: #28a745;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 0.6rem 1.5rem;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          box-shadow: none;
          transition: background 0.2s, transform 0.2s;
          margin-top: 0.5rem;
        }
        .service-form-btn:hover {
          background: #218838;
          transform: translateY(-2px) scale(1.03);
        }
        .service-form-btn-add, .service-form-btn-remove {
          background: #f8f9fa;
          color: #222;
          border: none;
          border-radius: 8px;
          padding: 0.35rem 0.8rem;
          font-weight: 500;
          font-size: 0.97rem;
          cursor: pointer;
          margin-top: 0.3rem;
          margin-right: 0.5rem;
          transition: background 0.2s, color 0.2s;
        }
        .service-form-btn-add:hover {
          background: #28a745;
          color: #fff;
        }
        .service-form-btn-remove {
          color: #dc3545;
        }
        .service-form-btn-remove:hover {
          background: #dc3545;
          color: #fff;
        }
        .service-form-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.98rem;
          color: #2c3e50;
          font-weight: 500;
          margin-top: 0.5rem;
        }
        .service-form-error {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 0.5rem;
          font-size: 0.98rem;
        }
        .service-form-success {
          color: #28a745;
          background: #e6f9ed;
          border: 1px solid #b7f5d8;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 0.5rem;
          font-size: 0.98rem;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right', autoClose: 5000 });
    }
  }, [error]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const service = await serviceService.getServiceById(id);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        features: service.features && service.features.length > 0 ? service.features : [''],
        icon: service.icon && service.icon !== 'default-icon' && service.icon !== 'miscellaneous_services' ? service.icon : 'build',
        isActive: service.isActive !== undefined ? service.isActive : true,
        whyChoose: service.whyChoose && service.whyChoose.length > 0 ? service.whyChoose : [''],
        ctaText: service.ctaText || '',
        ctaButtonText: service.ctaButtonText || 'Contact Us'
      });
    } catch (err) {
      setError('Failed to fetch service');
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleWhyChooseChange = (index, value) => {
    const newWhyChoose = [...formData.whyChoose];
    newWhyChoose[index] = value;
    setFormData(prev => ({
      ...prev,
      whyChoose: newWhyChoose
    }));
  };
  const addWhyChoose = () => {
    setFormData(prev => ({
      ...prev,
      whyChoose: [...prev.whyChoose, '']
    }));
  };
  const removeWhyChoose = (index) => {
    if (formData.whyChoose.length > 1) {
      const newWhyChoose = formData.whyChoose.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        whyChoose: newWhyChoose
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Service description is required');
      return;
    }

    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const serviceData = {
        ...formData,
        features: filteredFeatures,
        whyChoose: formData.whyChoose.filter(item => item.trim() !== ''),
      };

      if (id) {
        const token = user?.token || localStorage.getItem('token');
        console.log('User context:', user, 'Token used:', token);
        await serviceService.updateService(id, serviceData, token);
        setSuccess('Service updated successfully!');
        toast.success('Service updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const token = user?.token || localStorage.getItem('token');
        console.log('User context:', user, 'Token used:', token);
        await serviceService.createService(serviceData, token);
        setSuccess('Service created successfully!');
        toast.success('Service created successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setTimeout(() => {
        navigate('/admin/services');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save service');
      console.error('Error saving service:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div style={{ background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="admin-spinner" />
        <div style={{ marginTop: 16, color: '#6c757d', fontSize: '1.1rem' }}>Loading service...</div>
      </div>
    );
  }

  // ServiceCardPreview component for live preview
  const getMaterialIcon = getValidMaterialIcon;

  const ServiceCardPreview = ({ name, description, icon }) => (
    <div className="admin-service-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center', minHeight: 220, maxWidth: 380, width: '100%', margin: '0 auto' }}>
      <MaterialIcon 
        icon={icon} 
        style={{ fontSize: '2.8rem', color: '#28a745', background: '#e0fbe8', borderRadius: '50%', padding: 16, marginBottom: 16, marginTop: 8 }}
        fallback="⚙️"
      />
      <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.2rem', color: '#222', marginBottom: 8 }}>{name || 'Service Name'}</h3>
      <p style={{ color: '#6c757d', margin: 0, fontSize: '0.98rem', fontWeight: 400, marginBottom: 16 }}>{description || 'Service description will appear here.'}</p>
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto', opacity: 0.5 }}>
        <button className="admin-edit-button" disabled style={{ cursor: 'not-allowed' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: 2 }}>edit</span>
          Edit
        </button>
        <button className="admin-delete-button" disabled style={{ cursor: 'not-allowed' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', marginRight: 2 }}>delete</span>
          Delete
        </button>
      </div>
    </div>
  );

  // Helper for homepage icon
  const getHomepageIcon = (iconType) => {
    switch ((iconType || '').toLowerCase()) {
      case 'solar':
        return <FaSolarPanel style={{ fontSize: '2.2rem', color: '#28a745' }} />;
      case 'fabrication':
        return <FaCogs style={{ fontSize: '2.2rem', color: '#28a745' }} />;
      case 'research':
        return <FaFlask style={{ fontSize: '2.2rem', color: '#28a745' }} />;
      default:
        return <FaSolarPanel style={{ fontSize: '2.2rem', color: '#28a745' }} />;
    }
  };

  // Homepage Service Card Preview
  const HomepageServiceCardPreview = ({ name, description, icon, features }) => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 16, background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', padding: '1.5rem', maxWidth: 380, margin: '0 auto', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        {getHomepageIcon(icon)}
      </div>
      <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.2rem', color: '#222', textAlign: 'center', marginBottom: 8 }}>{name || 'Service Name'}</h3>
      <p style={{ color: '#6c757d', margin: 0, fontSize: '0.98rem', fontWeight: 400, textAlign: 'center', marginBottom: 12 }}>{description || 'Service description will appear here.'}</p>
      <div>
        <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', color: '#222' }}>Key Features:</h4>
        <ul style={{ paddingLeft: 18, margin: 0, color: '#222', fontSize: '0.97rem' }}>
          {(features && features.length > 0 ? features : ['Feature 1', 'Feature 2', 'Feature 3']).map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>
      <button disabled style={{ marginTop: 16, background: '#28a745', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', opacity: 0.7, cursor: 'not-allowed' }}>Learn More</button>
    </div>
  );

  // Learn More Modal Preview (non-modal)
  const LearnMorePreview = ({ service }) => (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '420px', width: '100%', color: '#222', boxShadow: '0 4px 24px rgba(40,167,69,0.08)', border: '1px solid #e0e0e0', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>{service.name || 'Service Name'}</h2>
        <p style={{ color: '#7f8c8d', lineHeight: '1.6', fontSize: '1.1rem' }}>{service.description || 'Service description will appear here.'}</p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>What We Offer</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {(service.features && service.features.length > 0 ? service.features : ['Feature 1', 'Feature 2', 'Feature 3']).map((feature, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCheck style={{ color: '#27ae60', flexShrink: 0 }} />
              <span style={{color:'#222'}}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Why Choose This Service?</h3>
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#222' }}>
            {(service.whyChoose && service.whyChoose.length > 0 ? service.whyChoose : [
              'Expert team with specialized knowledge',
              'Proven track record of successful projects',
              'Customized solutions for your specific needs',
              'Ongoing support and maintenance',
              'Competitive pricing and transparent quotes'
            ]).map((reason, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', color: '#222' }}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ background: '#eafaf1', padding: '1.5rem', borderRadius: '8px', border: '1px solid #b7eac7' }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Ready to Get Started?</h4>
        <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>{service.ctaText || 'Contact our team to discuss your project requirements and get a customized solution.'}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button disabled style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', opacity: 0.7, cursor: 'not-allowed' }}>
            {service.ctaButtonText || 'Contact Us'} <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="service-form-bg">
      {/* Outer wrapper for centering */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem 0', position: 'relative' }}>
        {/* Icon-only Back Button, absolutely positioned */}
        <button
          onClick={() => navigate('/admin/services')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'transparent',
            color: '#6c757d',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10
          }}
          className="admin-back-button"
          title="Back to Service Management"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#6c757d' }}>arrow_back</span>
        </button>
        {/* Main flex container with max width */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', alignItems: 'flex-start', maxWidth: 1100, width: '100%', justifyContent: 'center' }}>
          {/* Form Container - increased width */}
          <div style={{ flex: 1.2, maxWidth: 600, minWidth: 350 }}>
            <div className="service-form-card">
              <div className="service-form-title-row">
                <h1 className="service-form-title">{id ? 'Edit Service' : 'Create New Service'}</h1>
                <button 
                  type="button"
                  className="service-form-btn-cancel"
                  onClick={() => navigate('/admin/services')}
                >
                  <FaTimes style={{ marginRight: 6 }} /> Cancel
                </button>
              </div>
              {error && <div className="service-form-error">{error}</div>}
              {success && <div className="service-form-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="service-form-group">
                  <label htmlFor="name" className="service-form-label">Service Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter service name"
                    required
                    className="service-form-input"
                  />
                </div>
                <div className="service-form-group">
                  <label htmlFor="description" className="service-form-label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter service description"
                    rows="4"
                    required
                    className="service-form-textarea"
                  />
                </div>
                <div className="service-form-group">
                  <label htmlFor="icon" className="service-form-label">Icon</label>
                  <div style={{ width: 250, margin: '8px 0' }}>
                    <IconPicker value={formData.icon} onChange={icon => setFormData(prev => ({ ...prev, icon }))} />
                  </div>
                  <MaterialIcon 
                    icon={formData.icon} 
                    style={{ fontSize: 32, marginLeft: 8 }}
                    fallback="⚙️"
                  />
                </div>
                <div className="service-form-group">
                  <label className="service-form-label">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="service-form-input"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          className="service-form-btn-remove"
                          onClick={() => removeFeature(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="service-form-btn-add"
                    onClick={addFeature}
                  >
                    <FaPlus /> Add Feature
                  </button>
                </div>
                <div className="service-form-group">
                  <label className="service-form-label">Why Choose This Service?</label>
                  {formData.whyChoose.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleWhyChooseChange(index, e.target.value)}
                        placeholder={`Reason ${index + 1}`}
                        className="service-form-input"
                      />
                      {formData.whyChoose.length > 1 && (
                        <button type="button" className="service-form-btn-remove" onClick={() => removeWhyChoose(index)}><FaTrash /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="service-form-btn-add" onClick={addWhyChoose}><FaPlus /> Add Reason</button>
                </div>
                <div className="service-form-group">
                  <label className="service-form-checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      style={{ width: 18, height: 18 }}
                    />
                    Active Service
                  </label>
                </div>
                <button
                  type="submit"
                  className="service-form-btn"
                  disabled={loading}
                >
                  <FaSave style={{ marginRight: 8 }} />
                  {loading ? 'Saving...' : (id ? 'Update Service' : 'Create Service')}
                </button>
              </form>
            </div>
          </div>
          {/* Live Previews Container */}
          <div style={{ flex: '0 0 420px', maxWidth: 420, minWidth: 320, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#888', fontSize: '0.98rem', fontStyle: 'italic' }}>Homepage Service Card Preview</div>
              <HomepageServiceCardPreview name={formData.name} description={formData.description} icon={formData.icon} features={formData.features} />
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#888', fontSize: '0.98rem', fontStyle: 'italic' }}>Learn More Modal Preview</div>
              <LearnMorePreview service={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceForm; 