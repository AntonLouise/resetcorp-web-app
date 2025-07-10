import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../services/productService';
import { toast } from 'react-toastify';

// Add hover effects styles
if (typeof document !== 'undefined' && !document.getElementById('product-detail-hover-effects')) {
  const style = document.createElement('style');
  style.id = 'product-detail-hover-effects';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .product-thumbnail {
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    .product-thumbnail:hover {
      transform: scale(1.05);
      border-color: #28a745 !important;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
    }
    .product-qty-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .product-qty-btn:hover {
      background: #28a745 !important;
      color: #fff !important;
      transform: scale(1.1);
    }
    .product-add-cart-btn {
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    .product-add-cart-btn:hover:not(:disabled) {
      background: #218838 !important;
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
    }
    .product-tab-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .product-tab-btn:hover {
      background: #e8fbe8 !important;
      color: #28a745 !important;
      transform: translateY(-1px);
    }
    .product-breadcrumb-link {
      transition: color 0.2s, text-decoration 0.2s;
    }
    .product-breadcrumb-link:hover {
      color: #218838 !important;
      text-decoration: underline;
    }
    .product-spec-card {
      transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
    }
    .product-spec-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      background: #fff !important;
    }
    .product-feature-item {
      transition: background 0.2s, transform 0.2s;
    }
    .product-feature-item:hover {
      background: #f8f9fa !important;
      transform: translateX(5px);
    }
    .product-info-card {
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .product-info-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    
    addToCart({
      ...product,
      quantity: quantity
    });
  };

  const getProductImage = (index = 0) => {
    if (product?.images?.length > 0) {
      const img = product.images[index];
      if (typeof img === 'string') return img;
      if (img.url) return img.url;
    }
    return '/placeholder.png';
  };

  const getCurrentPrice = () => {
    if (product?.isOnSale && product?.salePrice) {
      return product.salePrice;
    }
    return product?.price || 0;
  };

  const getOriginalPrice = () => {
    if (product?.isOnSale && product?.salePrice) {
      return product.price;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        margin: '20px',
        padding: '3rem 0'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e8f5e8',
          borderTop: '4px solid #28a745',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{
          color: '#28a745',
          fontSize: '18px',
          fontWeight: '500',
          margin: 0
        }}>
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        fontSize: '18px',
        color: '#333'
      }}>
        <p>{error || 'Product not found'}</p>
        <button 
          onClick={() => navigate('/products')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8f9fa',
      paddingTop: '80px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          <span onClick={() => navigate('/products')} style={{ cursor: 'pointer', color: '#28a745' }} className="product-breadcrumb-link">
            Products
          </span>
          {' > '}
          <span>{product.category?.name}</span>
          {' > '}
          <span>{product.name}</span>
        </div>

        {/* Product Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* Product Images */}
          <div>
            <div style={{ 
              width: '100%', 
              height: '400px', 
              background: '#f8f9fa',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <img 
                src={getProductImage(selectedImage)}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }}
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      border: selectedImage === index ? '3px solid #28a745' : '1px solid #ddd',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#f8f9fa'
                    }}
                    className="product-thumbnail"
                  >
                    <img 
                      src={getProductImage(index)}
                      alt={`${product.name} ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '10px',
              color: '#333'
            }}>
              {product.name}
            </h1>
            
            {product.isNew && (
              <span style={{
                background: '#28a745',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '15px',
                display: 'inline-block'
              }}>
                NEW
              </span>
            )}
            
            {product.isOnSale && (
              <span style={{
                background: '#dc3545',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '15px',
                display: 'inline-block',
                marginLeft: '10px'
              }}>
                SALE
              </span>
            )}

            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#28a745'
              }}>
                ${getCurrentPrice().toFixed(2)}
              </span>
              {getOriginalPrice() && (
                <span style={{ 
                  fontSize: '1.2rem', 
                  color: '#999', 
                  textDecoration: 'line-through',
                  marginLeft: '10px'
                }}>
                  ${getOriginalPrice().toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#666', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                {product.shortDescription}
              </p>
            )}

            {/* Stock Status */}
            <div style={{ marginBottom: '20px' }}>
              {product.stock > 0 ? (
                <span style={{ color: '#28a745', fontWeight: '600' }}>
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span style={{ color: '#dc3545', fontWeight: '600' }}>
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <label style={{ fontWeight: '600', color: '#333' }}>Quantity:</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      padding: '10px 15px',
                      border: 'none',
                      background: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#333'
                    }}
                    className="product-qty-btn"
                  >
                    -
                  </button>
                  <span style={{ padding: '10px 20px', minWidth: '50px', textAlign: 'center', color: '#333' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{
                      padding: '10px 15px',
                      border: 'none',
                      background: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#333'
                    }}
                    className="product-qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: product.stock > 0 ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                }}
                className="product-add-cart-btn"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Quick Specs */}
            {product.specifications && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '10px',
                marginBottom: '20px'
              }} className="product-info-card">
                <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#333' }}>Quick Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {product.specifications.capacity && (
                    <div style={{ color: '#333' }}>
                      <strong>Capacity:</strong> {product.specifications.capacity}
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div style={{ color: '#333' }}>
                      <strong>Dimensions:</strong> {product.specifications.dimensions}
                    </div>
                  )}
                  {product.specifications.warranty && (
                    <div style={{ color: '#333' }}>
                      <strong>Warranty:</strong> {product.specifications.warranty}
                    </div>
                  )}
                  {product.specifications.efficiency && (
                    <div style={{ color: '#333' }}>
                      <strong>Efficiency:</strong> {product.specifications.efficiency}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Tabs */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            {['description', 'specifications', 'features'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '15px 30px',
                  border: 'none',
                  background: activeTab === tab ? '#28a745' : 'transparent',
                  color: activeTab === tab ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: '600',
                  borderBottom: activeTab === tab ? '3px solid #28a745' : 'none'
                }}
                className="product-tab-btn"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '200px' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Product Description</h3>
                <div style={{ lineHeight: '1.8', color: '#555' }}>
                  {product.detailedDescription || product.description || 'No description available.'}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Technical Specifications</h3>
                

                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => {
                    if (value && value !== '' && !Array.isArray(value)) {
                      return (
                        <div key={key} style={{ 
                          padding: '15px', 
                          background: '#f8f9fa', 
                          borderRadius: '5px',
                          color: '#333'
                        }} className="product-spec-card">
                          <strong style={{ textTransform: 'capitalize', color: '#333' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </strong>
                          <span style={{ marginLeft: '10px', color: '#555' }}>{value}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                  
                  {product.technicalSpecs && typeof product.technicalSpecs === 'object' && product.technicalSpecs !== null && (
                    <>
                      {Array.isArray(product.technicalSpecs) ? (
                        // Handle array format
                        product.technicalSpecs.map((spec, index) => (
                          <div key={index} style={{ 
                            padding: '15px', 
                            background: '#f8f9fa', 
                            borderRadius: '5px',
                            color: '#333'
                          }} className="product-spec-card">
                            <strong style={{ color: '#333' }}>{spec.key || `Spec ${index + 1}`}:</strong>
                            <span style={{ marginLeft: '10px', color: '#555' }}>{spec.value || ''}</span>
                          </div>
                        ))
                      ) : (
                        // Handle Map or object format
                        Object.entries(product.technicalSpecs).map(([key, value]) => (
                          <div key={key} style={{ 
                            padding: '15px', 
                            background: '#f8f9fa', 
                            borderRadius: '5px',
                            color: '#333'
                          }} className="product-spec-card">
                            <strong style={{ color: '#333' }}>{key}:</strong>
                            <span style={{ marginLeft: '10px', color: '#555' }}>{value}</span>
                          </div>
                        ))
                      )}
                    </>
                  )}
                  
                  {/* Show message if no specifications found */}
                  {(!product.specifications || Object.keys(product.specifications).filter(key => product.specifications[key] && product.specifications[key] !== '').length === 0) && 
                   (!product.technicalSpecs || (Array.isArray(product.technicalSpecs) ? product.technicalSpecs.length === 0 : Object.keys(product.technicalSpecs).length === 0)) && (
                    <div style={{ 
                      gridColumn: '1 / -1',
                      padding: '20px', 
                      background: '#f8f9fa', 
                      borderRadius: '5px',
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      <p>No specifications available for this product.</p>
                      <p style={{ fontSize: '14px', marginTop: '10px' }}>
                        Specifications can be added by an administrator in the admin panel.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>Product Features</h3>
                {product.features && product.features.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {product.features.map((feature, index) => (
                      <li key={index} style={{ 
                        padding: '10px 0', 
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#333'
                      }} className="product-feature-item">
                        <span style={{ 
                          color: '#28a745', 
                          marginRight: '10px',
                          fontSize: '20px'
                        }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#666' }}>No features listed for this product.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(product.manufacturer || product.modelNumber || product.countryOfOrigin) && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }} className="product-info-card">
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Additional Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {product.manufacturer && (
                <div style={{ color: '#333' }}>
                  <strong>Manufacturer:</strong> {product.manufacturer}
                </div>
              )}
              {product.modelNumber && (
                <div style={{ color: '#333' }}>
                  <strong>Model Number:</strong> {product.modelNumber}
                </div>
              )}
              {product.countryOfOrigin && (
                <div style={{ color: '#333' }}>
                  <strong>Country of Origin:</strong> {product.countryOfOrigin}
                </div>
              )}
              {product.sku && (
                <div style={{ color: '#333' }}>
                  <strong>SKU:</strong> {product.sku}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Installation and Safety Info */}
        {(product.installationInstructions || product.maintenanceGuide || product.safetyInformation) && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Product Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {product.installationInstructions && (
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '10px' 
                }} className="product-info-card">
                  <h4 style={{ marginBottom: '10px', color: '#28a745' }}>Installation Instructions</h4>
                  <div style={{ whiteSpace: 'pre-line', color: '#333' }}>{product.installationInstructions}</div>
                </div>
              )}
              
              {product.maintenanceGuide && (
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '20px', 
                  borderRadius: '10px' 
                }} className="product-info-card">
                  <h4 style={{ marginBottom: '10px', color: '#28a745' }}>Maintenance Guide</h4>
                  <div style={{ whiteSpace: 'pre-line', color: '#333' }}>{product.maintenanceGuide}</div>
                </div>
              )}
              
              {product.safetyInformation && (
                <div style={{ 
                  background: '#fff3cd', 
                  padding: '20px', 
                  borderRadius: '10px',
                  border: '1px solid #ffeaa7'
                }}>
                  <h4 style={{ marginBottom: '10px', color: '#856404' }}>Safety Information</h4>
                  <div style={{ whiteSpace: 'pre-line', color: '#856404' }}>{product.safetyInformation}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 