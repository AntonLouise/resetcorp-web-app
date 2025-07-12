import React, { useEffect } from "react";
import Select from "react-select";
import { materialIconCategories } from "./materialIcons";

// Utility function to ensure valid Material Icons
export const getValidMaterialIcon = (icon) => {
  if (!icon || icon === 'default-icon' || icon === 'miscellaneous_services') return 'build';
  
  const normalized = icon.toLowerCase();
  const iconMap = {
    solar: 'solar_power',
    fabrication: 'build',
    research: 'science',
    // Add more mappings as needed
  };
  
  const allowedIcons = [
    'solar_power', 'build', 'settings', 'miscellaneous_services', 'engineering', 'search', 'science', 'bolt', 'eco', 'energy_savings_leaf', 'factory', 'construction', 'support', 'manage_accounts', 'check_circle', 'cancel', 'edit', 'delete', 'add',
  ];
  
  const mapped = iconMap[normalized];
  let result;
  if (mapped && allowedIcons.includes(mapped)) result = mapped;
  else if (allowedIcons.includes(normalized)) result = normalized;
  else result = 'miscellaneous_services';
  
  return result;
};

// Component to render icons with fallback
export const MaterialIcon = ({ icon, className = "material-symbols-outlined", style = {}, fallback = "⚙️" }) => {
  const validIcon = getValidMaterialIcon(icon);
  
  // Debug logging
  console.log('MaterialIcon render:', { originalIcon: icon, validIcon, className });
  
  useEffect(() => {
    // Inject CSS to ensure Material Icons are properly styled
    if (typeof document !== 'undefined' && !document.getElementById('material-icons-fix')) {
      const style = document.createElement('style');
      style.id = 'material-icons-fix';
      style.textContent = `
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Check if Material Icons font is loaded
    const testIcon = document.createElement('span');
    testIcon.className = 'material-symbols-outlined';
    testIcon.textContent = 'home';
    testIcon.style.position = 'absolute';
    testIcon.style.left = '-9999px';
    document.body.appendChild(testIcon);
    
    // Check if the font is loaded by measuring the width
    const isLoaded = testIcon.offsetWidth > 0;
    document.body.removeChild(testIcon);
    
    if (!isLoaded) {
      console.warn('Material Icons font may not be loaded properly');
    }
  }, []);
  
  return (
    <span 
      className={className} 
      style={style}
      title={validIcon} // Add tooltip for debugging
      onError={(e) => {
        console.warn('Material Icon failed to load:', validIcon);
        // If the icon fails to load, show fallback
        e.target.style.display = 'none';
        const fallbackSpan = document.createElement('span');
        fallbackSpan.textContent = fallback;
        fallbackSpan.style.fontSize = style.fontSize || '1rem';
        e.target.parentNode.appendChild(fallbackSpan);
      }}
    >
      {validIcon}
    </span>
  );
};

const groupedOptions = materialIconCategories.map(category => ({
  label: category.label,
  options: category.options.map(icon => ({
    value: icon,
    label: (
      <span style={{ display: "flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 24, marginRight: 8 }}>{icon}</span>
        {icon}
      </span>
    )
  }))
}));

const customStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff',
    color: '#222',
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#e6f9ed' : '#fff',
    color: '#222',
    display: "flex",
    alignItems: "center"
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    color: '#222',
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#28a745',
    boxShadow: '0 2px 10px rgba(40,167,69,0.08)',
  }),
  input: (provided) => ({
    ...provided,
    color: '#222',
  }),
};

const IconPicker = ({ value, onChange }) => (
  <Select
    options={groupedOptions}
    value={
      groupedOptions
        .flatMap(group => group.options)
        .find(opt => opt.value === getValidMaterialIcon(value))
    }
    onChange={opt => onChange(opt.value)}
    isSearchable
    placeholder="Select an icon..."
    styles={customStyles}
  />
);

export default IconPicker; 