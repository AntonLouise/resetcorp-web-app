import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/adminService';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    services: 0,
    revenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    readyForPickupOrders: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
    newProducts: 0,
    onSaleProducts: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    adminUsers: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    topCategories: [],
    monthlyRevenue: [],
    orderStatus: [],
    recentActivity: [],
    trends: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!document.getElementById('admin-dashboard-hover-effects')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'admin-dashboard-hover-effects';
      styleSheet.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideInRight {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .admin-card {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        }
        .admin-card:hover .card-icon {
          transform: scale(1.1) !important;
          color: #28a745 !important;
        }
        .admin-card:hover .card-title {
          color: #28a745 !important;
        }
        .admin-card:hover .card-count {
          transform: scale(1.05) !important;
        }
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .stat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
        }
        .chart-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .chart-container:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important;
        }
        .admin-card:nth-child(1) { animation-delay: 0.1s; }
        .admin-card:nth-child(2) { animation-delay: 0.2s; }
        .admin-card:nth-child(3) { animation-delay: 0.3s; }
        .admin-card:nth-child(4) { animation-delay: 0.4s; }
        .admin-card:nth-child(5) { animation-delay: 0.5s; }
        .admin-card:nth-child(6) { animation-delay: 0.6s; }
        .quick-action-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .quick-action-btn:hover {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.25) !important;
          background: #218838 !important;
        }
        .quick-action-btn:hover .action-icon {
          transform: scale(1.1) !important;
          color: #fff !important;
        }
        .refresh-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .refresh-btn:hover {
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
          background: #f8f9fa !important;
        }
        .refresh-btn:active {
          transform: translateY(0) scale(0.98) !important;
        }
        .refresh-btn.clicked .material-symbols-outlined {
          animation: rotate360 0.6s ease-in-out !important;
        }
        @keyframes rotate360 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('=== FETCHING DASHBOARD STATISTICS ===');
      
      const data = await getDashboardStats();
      console.log('=== DASHBOARD STATISTICS RECEIVED ===');
      console.log('Data received:', data);
      
      setStats(data);
      setLastUpdated(new Date());
      
      // Show toast notification for auto-updates (not manual refresh)
      if (!loading) {
        toast.success('Dashboard updated successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    // Clear dashboard cache to force fresh data
    api.clearCache('/admin/dashboard/stats');
    fetchStats();
    // Remove the clicked class after animation completes
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const mainStats = [
    {
      title: 'Total Revenue',
      count: `₱${stats.revenue.toLocaleString()}`,
      description: 'Total revenue from all orders',
      icon: 'payments',
      color: '#28a745',
      trend: stats.trends?.revenue || '+12.5%'
    },
    {
      title: 'Products',
      count: stats.products,
      description: 'Total products in catalog',
      icon: 'inventory_2',
      color: '#007bff',
      trend: stats.trends?.products || '+5.2%'
    },
    {
      title: 'Orders',
      count: stats.orders,
      description: 'Total orders processed',
      icon: 'shopping_cart',
      color: '#6f42c1',
      trend: stats.trends?.orders || '+8.3%'
    },
    {
      title: 'Users',
      count: stats.users,
      description: 'Registered users',
      icon: 'group',
      color: '#e83e8c',
      trend: stats.trends?.users || '+3.7%'
    },
    {
      title: 'Pending Orders',
      count: stats.pendingOrders,
      description: 'Orders awaiting processing',
      icon: 'schedule',
      color: '#ffc107',
      trend: stats.trends?.pendingOrders || '-2.1%'
    },
    {
      title: 'Low Stock Items',
      count: stats.lowStockProducts,
      description: 'Products running low',
      icon: 'warning',
      color: '#dc3545',
      trend: stats.trends?.lowStockProducts || '+1.8%'
    }
  ];

  const quickStats = [
    {
      label: 'Avg Order Value',
      value: `₱${stats.avgOrderValue.toFixed(2)}`,
      icon: 'credit_card'
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: 'trending_up'
    },
    {
      label: 'New Users Today',
      value: stats.newUsersToday,
      icon: 'person_add'
    },
    {
      label: 'Completed Orders',
      value: stats.completedOrders,
      icon: 'check_circle'
    }
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Error Loading Dashboard</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={fetchStats}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Welcome back! Here's your store overview for today.</p>
            {lastUpdated && (
              <p style={styles.lastUpdated}>
                Last updated: {lastUpdated.toLocaleTimeString()}
                <span style={styles.autoUpdateIndicator}> • Auto-updating every 30s</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Refresh Button */}
        <div style={styles.refreshButtonContainer}>
          <button 
            style={{
              ...styles.refreshButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            className={`refresh-btn ${isRefreshing ? 'clicked' : ''}`}
            onClick={handleRefreshClick}
            disabled={loading}
            title={loading ? 'Updating...' : 'Refresh dashboard'}
          >
            <span 
              className="material-symbols-outlined" 
              style={{
                ...styles.refreshIcon,
                animation: loading ? 'spin 1s linear infinite' : 'none'
              }}
            >
              {loading ? 'sync' : 'cached'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={styles.statsGrid}>
        {mainStats.map((stat, index) => (
          <div key={index} style={styles.statCard} className="admin-card stat-card">
            <div style={styles.statHeader}>
              <span style={styles.statIcon} className="material-symbols-outlined">{stat.icon}</span>
              <span style={{...styles.statTrend, color: stat.trend.startsWith('+') ? '#28a745' : '#dc3545'}}>
                {stat.trend}
              </span>
            </div>
            <div style={styles.statContent}>
              <h3 style={{...styles.statCount, color: stat.color}}>{stat.count}</h3>
              <p style={styles.statTitle}>{stat.title}</p>
              <p style={styles.statDescription}>{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div style={styles.quickStatsContainer}>
        {quickStats.map((stat, index) => (
          <div key={index} style={styles.quickStat}>
            <span style={styles.quickStatIcon} className="material-symbols-outlined">{stat.icon}</span>
            <div style={styles.quickStatContent}>
              <div style={styles.quickStatValue}>{stat.value}</div>
              <div style={styles.quickStatLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid}>
        {/* Revenue Chart */}
        <div style={styles.chartContainer} className="chart-container">
          <h3 style={styles.chartTitle}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#28a745" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#28a745" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => [`₱${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Chart */}
        <div style={styles.chartContainer} className="chart-container">
          <h3 style={styles.chartTitle}>Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.orderStatus}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.orderStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={styles.pieChartLegend}>
            {stats.orderStatus.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <div style={{...styles.legendColor, backgroundColor: item.color}}></div>
                <span style={styles.legendText}>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div style={styles.chartContainer} className="chart-container">
          <h3 style={styles.chartTitle}>Top Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.topCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Share']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity - Full Width */}
      <div style={styles.fullWidthContainer}>
        <div style={styles.chartContainer} className="chart-container">
          <h3 style={styles.chartTitle}>Recent Activity</h3>
          <div style={styles.activityList}>
            {stats.recentActivity.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  <span className="material-symbols-outlined">{activity.icon}</span>
                </div>
                <div style={styles.activityContent}>
                  <div style={styles.activityAction}>{activity.action}</div>
                  <div style={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickActions}>
          <button 
            style={styles.actionButton}
            className="quick-action-btn"
            onClick={() => {
              navigate('/admin/products');
              window.scrollTo(0, 0);
            }}
          >
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">inventory_2</span>
            Manage Products
          </button>
          <button 
            style={styles.actionButton}
            className="quick-action-btn"
            onClick={() => {
              navigate('/admin/orders');
              window.scrollTo(0, 0);
            }}
          >
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">shopping_cart</span>
            Manage Orders
          </button>
          <button 
            style={styles.actionButton}
            className="quick-action-btn"
            onClick={() => {
              navigate('/admin/users');
              window.scrollTo(0, 0);
            }}
          >
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">group</span>
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '2rem',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    marginBottom: '3rem'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    position: 'relative'
  },
  headerText: {
    textAlign: 'center'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    margin: 0
  },
  lastUpdated: {
    fontSize: '0.85rem',
    color: '#6c757d',
    margin: '0.5rem 0 0 0',
    fontStyle: 'italic'
  },
  autoUpdateIndicator: {
    color: '#28a745',
    fontWeight: '500'
  },
  refreshButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: 'white',
    color: '#6c757d',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  refreshIcon: {
    fontSize: '1.5rem',
    color: '#6c757d'
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  statIcon: {
    fontSize: '1.5rem',
    color: '#6c757d',
    transition: 'all 0.3s ease'
  },
  statTrend: {
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  statContent: {
    textAlign: 'left'
  },
  statCount: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0'
  },
  statTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.25rem 0'
  },
  statDescription: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0
  },
  quickStatsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  quickStat: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  quickStatIcon: {
    fontSize: '1.5rem',
    marginRight: '0.75rem',
    color: '#6c757d'
  },
  quickStatContent: {
    flex: 1
  },
  quickStatValue: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  quickStatLabel: {
    fontSize: '0.85rem',
    color: '#6c757d'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  fullWidthContainer: {
    width: '100%',
    marginBottom: '2rem'
  },
  chartContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  chartTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  pieChartLegend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem'
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '0.5rem'
  },
  legendText: {
    color: '#6c757d'
  },
  activityList: {
    maxHeight: '200px',
    overflowY: 'auto'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0'
  },
  activityIcon: {
    fontSize: '1.2rem',
    marginRight: '0.75rem',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa'
  },
  activityContent: {
    flex: 1
  },
  activityAction: {
    fontSize: '0.9rem',
    color: '#2c3e50',
    fontWeight: '500'
  },
  activityTime: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.5rem'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '800px',
    margin: '0 auto'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 1.5rem',
    background: '#28a745',
    borderRadius: '12px',
    border: 'none',
    color: '#fff',
    fontWeight: '500',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 10px rgba(40, 167, 69, 0.2)'
  },
  actionIcon: {
    fontSize: '1.2rem',
    marginRight: '0.5rem',
    color: '#fff'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: '0.5rem'
  },
  errorMessage: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '1.5rem',
    maxWidth: '400px'
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(40, 167, 69, 0.2)'
  }
};


export default AdminDashboard; 