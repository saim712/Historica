




import React, { useState } from 'react';
import NewsCard from './NewsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Squares2X2Icon, 
  ListBulletIcon,
  ArrowPathIcon,
  FunnelIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const NewsFeed = ({ news, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Fetching latest conflict updates...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            background: var(--surface);
            border-radius: 1rem;
            padding: 2rem;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(59, 130, 246, 0.1);
            border-left-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📰</span>
        <h3>No News Available</h3>
        <p>Check back later for updates on Iran, Israel, Gaza, and regional conflicts</p>
        <button 
          className="refresh-btn"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="icon" />
          Refresh Now
        </button>
        <style>{`
          .empty-state {
            text-align: center;
            padding: 4rem;
            background: var(--surface);
            border-radius: 1rem;
          }
          .empty-icon {
            font-size: 4rem;
            display: block;
            margin-bottom: 1rem;
          }
          .refresh-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1.5rem;
          }
          .refresh-btn:hover {
            background: var(--primary-dark);
          }
        `}</style>
      </div>
    );
  }

  // Sort news
  const sortedNews = [...news].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
  });

  // Group by region for better organization
  const newsByRegion = sortedNews.reduce((acc, article) => {
    const region = article.region || 'Middle East';
    if (!acc[region]) acc[region] = [];
    acc[region].push(article);
    return acc;
  }, {});

  return (
    <div className="news-feed">
      <style>{`
        .news-feed {
          width: 100%;
        }
        
        .feed-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
          background: var(--surface);
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
        }
        
        .controls-left {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .view-toggle {
          display: flex;
          gap: 0.25rem;
          background: var(--bg);
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
        }
        
        .toggle-btn {
          padding: 0.5rem;
          border: none;
          background: transparent;
          border-radius: 0.375rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toggle-btn .icon {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .toggle-btn.active {
          background: var(--primary);
          color: white;
        }
        
        .sort-select {
          padding: 0.5rem 2rem 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          background: var(--bg);
          color: var(--text);
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }
        
        .stats-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg);
          border-radius: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          border: 1px solid var(--border);
        }
        
        .stats-badge .icon-small {
          width: 1rem;
          height: 1rem;
        }
        
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        .news-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .region-group {
          background: var(--surface);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        
        .region-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          margin: 0;
          background: linear-gradient(to right, var(--primary-light), transparent);
          color: var(--text);
          font-size: 1rem;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
        }
        
        .region-header .icon-small {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--primary);
        }
        
        .region-articles {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }
          
          .feed-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .controls-left {
            justify-content: space-between;
          }
        }
      `}</style>

      {/* Controls Bar */}
      <div className="feed-controls">
        <div className="controls-left">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Squares2X2Icon className="icon" />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <ListBulletIcon className="icon" />
            </button>
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div className="stats-badge">
          <FunnelIcon className="icon-small" />
          <span>{sortedNews.length} articles</span>
        </div>
      </div>

      {/* News Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            className="news-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedNews.map((article, index) => (
              <NewsCard 
                key={`${article.publishedAt}-${index}`} 
                article={article} 
                featured={index === 0} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            className="news-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Object.entries(newsByRegion).map(([region, articles]) => (
              <div key={region} className="region-group">
                <h3 className="region-header">
                  <MapPinIcon className="icon-small" />
                  {region} <span style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 'normal' }}>({articles.length})</span>
                </h3>
                <div className="region-articles">
                  {articles.map((article, index) => (
                    <NewsCard 
                      key={`${article.publishedAt}-${index}`} 
                      article={article} 
                      listView={true}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsFeed;