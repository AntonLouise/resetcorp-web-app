import React from 'react';

const spinnerStyle = {
  width: 32,
  height: 32,
  border: '3px solid #e0e0e0',
  borderTop: '3px solid #28a745',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto',
};

const ConfirmModal = ({
  open,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.18)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(40,167,69,0.13)',
        minWidth: 320,
        maxWidth: '90vw',
        padding: '2.2rem 1.5rem 1.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10, color: '#222', textAlign: 'center' }}>{title}</div>
        <div style={{ fontSize: 15, color: '#444', marginBottom: 24, textAlign: 'center', maxWidth: 320 }}>{message}</div>
        {loading ? (
          <div style={{ margin: '18px 0 10px 0' }}>
            <div style={spinnerStyle}></div>
            <div style={{ fontSize: 14, color: '#888', marginTop: 10 }}>Deleting...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
            <button
              onClick={onCancel}
              style={{
                background: '#f5f5f5',
                color: '#222',
                border: 'none',
                borderRadius: 8,
                padding: '8px 22px',
                fontWeight: 500,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.18s',
                minWidth: 80,
              }}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 22px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.18s',
                minWidth: 80,
              }}
              disabled={loading}
            >
              {confirmText}
            </button>
          </div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmModal; 