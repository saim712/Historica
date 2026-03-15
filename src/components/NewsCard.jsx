




import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  NewspaperIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const NewsCard = ({ article, featured = false, listView = false }) => {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Get source icon
  const getSourceIcon = () => {
    const source = article.source?.name?.toLowerCase() || '';
    if (source.includes('bbc')) return '🇬🇧';
    if (source.includes('cnn')) return '🇺🇸';
    if (source.includes('fox')) return '🇺🇸';
    if (source.includes('reuters')) return '🌐';
    if (source.includes('ap')) return '📰';
    if (source.includes('al jazeera')) return '🇶🇦';
    if (source.includes('haaretz')) return '🇮🇱';
    return '📰';
  };

  // Fallback image if main image fails
  const getFallbackImage = () => {
    const category = article.category?.name?.toLowerCase() || '';
    if (category.includes('military')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/US_Navy_030327-N-5363A-002_USS_Abraham_Lincoln_%28CVN_72%29.jpg/800px-US_Navy_030327-N-5363A-002_USS_Abraham_Lincoln_%28CVN_72%29.jpg';
    if (category.includes('conflict')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/1948_Arab_Israeli_War_May_15_-_June_10_1948.png/800px-1948_Arab_Israeli_War_May_15_-_June_10_1948.png';
    if (category.includes('casualties')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Gaza_Strip_destruction_2014.jpg/800px-Gaza_Strip_destruction_2014.jpg';
    if (category.includes('diplomacy')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Clinton_Rabin_Arafat_1993-09-13.jpg/800px-Clinton_Rabin_Arafat_1993-09-13.jpg';
    if (category.includes('nuclear')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Iran-Iraq_war_1980-1988.png/800px-Iran-Iraq_war_1980-1988.png';
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Jerusalem_%28%E2%80%A2_Old_City%29_%289072006436%29.jpg/800px-Jerusalem_%28%E2%80%A2_Old_City%29_%289072006436%29.jpg';
  };

<<<<<<< HEAD
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
=======
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, transition: { duration: 0.2 } }
  };

  if (listView) {
    return (
      <motion.div 
        className="news-card list-view"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <style>{`
          .news-card.list-view {
            display: grid;
            grid-template-columns: 120px 1fr auto;
            gap: 1rem;
            background: var(--bg);
            border-radius: 0.75rem;
            overflow: hidden;
            border: 1px solid var(--border);
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .news-card.list-view:hover {
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          
          .list-view .card-image {
            width: 120px;
            height: 100px;
            object-fit: cover;
          }
          
          .list-view .card-content {
            padding: 1rem;
            flex: 1;
          }
          
          .list-view .card-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .list-view .card-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0 0 0.25rem 0;
            color: var(--text);
          }
          
          .list-view .card-description {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.5;
          }
          
          .list-view .card-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 0.5rem;
          }
          
          .list-view .badge {
            padding: 0.25rem 0.75rem;
            background: var(--surface);
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .list-view .card-actions {
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          @media (max-width: 768px) {
            .news-card.list-view {
              grid-template-columns: 1fr;
            }
            
            .list-view .card-image {
              width: 100%;
              height: 160px;
            }
          }
        `}</style>

        <img 
          src={imageError ? getFallbackImage() : (article.urlToImage || getFallbackImage())}
          alt={article.title}
          className="card-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        <div className="card-content">
          <div className="card-header">
            <span className="badge" style={{ background: article.category?.color + '20', color: article.category?.color }}>
              {article.category?.icon} {article.category?.name}
            </span>
            <span className="badge" style={{ background: article.sentiment?.color + '20', color: article.sentiment?.color }}>
              {article.sentiment?.icon} {article.sentiment?.type}
            </span>
          </div>

          <h3 className="card-title">{article.title}</h3>
          <p className="card-description">{article.description}</p>

          <div className="card-meta">
            <span className="badge">
              <CalendarIcon className="icon-small" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="badge">
>>>>>>> 5b51205 (map updation)
              <MapPinIcon className="icon-small" />
              {article.region}
            </span>
            {article.casualties && (
              <span className="badge" style={{ background: '#ef444420', color: '#ef4444' }}>
                <UserGroupIcon className="icon-small" />
                {article.casualties}+ casualties
              </span>
            )}
          </div>
        </div>

        <div className="card-actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="source-link"
            style={{
              padding: '0.5rem',
              background: 'var(--surface)',
              borderRadius: '0.5rem',
              color: 'var(--text-muted)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowTopRightOnSquareIcon className="icon-small" />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`news-card ${featured ? 'featured' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => setExpanded(!expanded)}
    >
      <style>{`
        .news-card {
          background: var(--surface);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          height: fit-content;
        }
        
        .news-card.featured {
          grid-column: span 2;
        }
        
        .news-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .card-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: var(--bg);
        }
        
        .news-card.featured .card-image-container {
          height: 300px;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        
        .news-card:hover .card-image {
          transform: scale(1.05);
        }
        
        .card-overlay {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          display: flex;
          gap: 0.5rem;
        }
        
        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          font-weight: 600;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          color: white;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .source-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          border-radius: 2rem;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .card-content {
          padding: 1.5rem;
        }
        
        .news-card.featured .card-content {
          padding: 2rem;
        }
        
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          color: var(--text);
          line-height: 1.4;
        }
        
        .news-card.featured .card-title {
          font-size: 1.3rem;
        }
        
        .card-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0 0 1rem 0;
          line-height: 1.6;
        }
        
        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .icon-small {
          width: 1rem;
          height: 1rem;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        
        .source-name {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        
        .read-more:hover {
          background: var(--primary-dark);
        }
        
        .expanded-content {
          margin-top: 1rem;
          padding: 1rem;
          background: var(--bg);
          border-radius: 0.5rem;
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .news-card.featured {
            grid-column: span 1;
          }
          
          .news-card.featured .card-image-container {
            height: 200px;
          }
        }
      `}</style>

      <div className="card-image-container">
        <img 
          src={imageError ? getFallbackImage() : (article.urlToImage || getFallbackImage())}
          alt={article.title}
          className="card-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        <div className="card-overlay">
          <span className="category-badge" style={{ background: article.category?.color }}>
            {article.category?.icon} {article.category?.name}
          </span>
          <span className="category-badge" style={{ background: article.sentiment?.color }}>
            {article.sentiment?.icon} {article.sentiment?.type}
          </span>
        </div>

        <div className="source-badge">
          {getSourceIcon()} {article.source?.name}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-description">{article.description}</p>

        <div className="card-meta">
          <div className="meta-item">
            <CalendarIcon className="icon-small" />
            {formatDate(article.publishedAt)}
          </div>
          <div className="meta-item">
            <MapPinIcon className="icon-small" />
            {article.region}
          </div>
          {article.casualties && (
            <div className="meta-item" style={{ color: '#ef4444' }}>
              <UserGroupIcon className="icon-small" />
              {article.casualties}+ casualties
            </div>
          )}
        </div>

        {expanded && article.content && (
          <motion.div 
            className="expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>{article.content}</p>
            {article.militaryBase && (
              <p style={{ marginTop: '0.5rem', color: 'var(--primary)' }}>
                🏰 Military base: {article.militaryBase}
              </p>
            )}
          </motion.div>
        )}

        <div className="card-footer">
          <span className="source-name">
            <NewspaperIcon className="icon-small" />
            {article.author || article.source?.name}
          </span>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more"
            onClick={(e) => e.stopPropagation()}
          >
            Read More
            <ArrowTopRightOnSquareIcon className="icon-small" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
