import React from 'react';
import { 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const Header = ({ 
  lastUpdate, 
  loading, 
  onRefresh, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  setSidebarOpen 
}) => {
  const categories = [
    'all',
    'military',
    'conflict',
    'diplomacy',
    'casualties',
    'analysis'
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="menu-button"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="search-container">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search news, events, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="category-filter">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="select-icon" />
        </div>

        <button className="notification-button">
          <BellIcon className="icon" />
          <span className="notification-badge">3</span>
        </button>

        <button 
          className={`refresh-button ${loading ? 'loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
        >
          <ArrowPathIcon className={`icon ${loading ? 'spin' : ''}`} />
        </button>

        {lastUpdate && (
          <div className="update-info">
            <span className="update-label">Last Update</span>
            <span className="update-time">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;