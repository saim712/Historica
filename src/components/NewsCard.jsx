import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookmarkIcon, 
  ShareIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  FireIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const NewsCard = ({ article, featured }) => {
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Military': '⚔️',
      'Casualties': '💔',
      'Diplomacy': '🤝',
      'Conflict': '💥',
      'Nuclear': '☢️',
      'Base': '🏰',
      'General': '📰'
    };
    return icons[category?.name] || '📰';
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Generate a contextual placeholder image when the article does not provide one
  const getPlaceholderImage = () => {
    const keywords = [
      article.category?.name,
      article.region,
      article.source?.name,
      article.title
    ].filter(Boolean).join(' ');

    // Unsplash provides a random photo matching the query terms
    const query = encodeURIComponent(keywords || 'world news');
    return `https://source.unsplash.com/800x500/?${query}`;
  };

  const imageSrc = !imageError && article.urlToImage ? article.urlToImage : getPlaceholderImage();

  return (
    <motion.article 
      className={`news-card ${featured ? 'featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Section */}
      <div className="news-image-wrapper">
        <img 
          src={imageSrc} 
          alt={article.title}
          className="news-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Image Overlay Badges */}
        <div className="news-image-overlay">
          {article.region && (
            <span className="region-badge">
              <MapPinIcon className="icon-small" />
              {article.region}
            </span>
          )}
          {article.casualties && (
            <span className="casualty-badge">
              <FireIcon className="icon-small" />
              {article.casualties}+
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="news-content">
        {/* Header with Source and Time */}
        <div className="news-header">
          <div className="news-meta">
            <span className="source-name">
              <NewspaperIcon className="icon-small" />
              {article.source?.name || 'News Agency'}
            </span>
            <span className="time-stamp">
              <ClockIcon className="icon-small" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          
          <div className="news-actions">
            <button 
              className={`action-btn ${saved ? 'active' : ''}`}
              onClick={() => setSaved(!saved)}
              aria-label="Save article"
            >
              {saved ? <BookmarkSolidIcon className="icon" /> : <BookmarkIcon className="icon" />}
            </button>
            <button className="action-btn" aria-label="Share article">
              <ShareIcon className="icon" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="news-title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {/* Description */}
        <p className={`news-description ${expanded ? 'expanded' : ''}`}>
          {expanded 
            ? article.description || article.content || 'No description available'
            : truncateText(article.description || article.content || 'No description available', 120)
          }
        </p>

        {/* Read More Button */}
        {(article.description?.length > 120 || article.content?.length > 120) && (
          <button 
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Footer with Categories and Sentiment */}
        <div className="news-footer">
          <div className="footer-left">
            {article.category && (
              <span 
                className="category-pill" 
                style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
              >
                <span className="category-icon">{article.category.icon}</span>
                {article.category.name}
              </span>
            )}
            
            {article.militaryBase && (
              <span className="base-pill">
                <span className="base-icon">🏰</span>
                {article.militaryBase}
              </span>
            )}
          </div>

          {article.sentiment && (
            <span 
              className="sentiment-pill"
              style={{ backgroundColor: article.sentiment.color + '15', color: article.sentiment.color }}
            >
              <span>{article.sentiment.icon}</span>
              {article.sentiment.type}
            </span>
          )}
        </div>

        {/* Author if available */}
        {article.author && article.author !== 'null' && article.author !== '' && (
          <div className="news-author">
            <UserIcon className="icon-small" />
            <span>{article.author}</span>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default NewsCard;