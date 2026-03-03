import React, { useState } from 'react';
import NewsCard from './NewsCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Squares2X2Icon, 
  ListBulletIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const NewsFeed = ({ news, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Fetching latest conflict updates...</p>
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
                  {region} ({articles.length})
                </h3>
                <div className="region-articles">
                  {articles.map((article, index) => (
                    <NewsCard 
                      key={`${article.publishedAt}-${index}`} 
                      article={article} 
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