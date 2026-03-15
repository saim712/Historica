import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
<<<<<<< HEAD
  InformationCircleIcon,
=======
  PhotoIcon
>>>>>>> 5b51205 (map updation)
} from '@heroicons/react/24/outline';

// ─── Wikipedia helpers ────────────────────────────────────────────────────────

/**
 * Build the canonical Wikipedia article URL from a slug.
 * The slug is stored on each event as `wikiSlug` in historyData.js.
 * Falls back to a Wikipedia search if no slug is provided.
 */
const wikiUrl = (event) => {
  if (event.wikiSlug) {
    return `https://en.wikipedia.org/wiki/${event.wikiSlug}`;
  }
  // Fallback: Wikipedia full-text search — always finds the right article
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(event.event)}`;
};

/**
 * Fetch the Wikipedia thumbnail for an event using the REST summary API.
 * Called in the browser — works fine there even though server-side is blocked.
 * Returns the image URL string, or null on failure.
 */
const fetchWikiThumbnail = async (wikiSlug) => {
  if (!wikiSlug) return null;
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Prefer originalimage (higher res) over thumbnail
    return (
      data.originalimage?.source ||
      data.thumbnail?.source ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Inline SVG placeholder — renders immediately, never produces a broken image.
 * Used while the Wikipedia API call is in flight, or as final fallback.
 */
const makePlaceholder = (label = '') => {
  const safe = (label || 'Event').replace(/[<>&"']/g, '').slice(0, 40);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460">` +
    `<rect width="800" height="460" fill="#0f172a"/>` +
    `<rect x="32" y="32" width="736" height="396" rx="8" fill="#1e293b"/>` +
    `<text x="400" y="215" font-family="system-ui,sans-serif" font-size="16" ` +
    `fill="#475569" text-anchor="middle">${safe}</text>` +
    `<text x="400" y="248" font-family="system-ui,sans-serif" font-size="13" ` +
    `fill="#334155" text-anchor="middle">Loading image from Wikipedia…</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// ─── useEventImage hook ───────────────────────────────────────────────────────

/**
 * Resolves the best available image for one event.
 *
 * Resolution order:
 *   1. Wikipedia API thumbnail (fetched live in the browser — always correct)
 *   2. event.image  (verified Wikimedia Commons URL from historyData.js)
 *   3. SVG placeholder  (never fails)
 *
 * We start with the SVG placeholder so something shows immediately,
 * then replace it once the Wikipedia API responds (~200ms on fast connections).
 * If the API call fails, we fall through to event.image.
 * If event.image also fails (onError), we lock in the SVG placeholder.
 */
function useEventImage(event) {
  const [src, setSrc] = useState(() => makePlaceholder(event?.event));
  const fetched = useRef(false);

  useEffect(() => {
    if (!event || fetched.current) return;
    fetched.current = true;

    // Start with hardcoded fallback immediately (no flicker while API loads)
    if (event.image) setSrc(event.image);

    // Then try to upgrade to the real Wikipedia thumbnail
    fetchWikiThumbnail(event.wikiSlug).then((apiImg) => {
      if (apiImg) setSrc(apiImg);
      // If API returns null, event.image is already set above — nothing to do
    });
  }, [event]);

  // If the <img> tag itself fires an error (e.g. 404 on event.image),
  // fall back to the SVG placeholder as a guaranteed last resort
  const onError = useCallback(() => {
    setSrc(makePlaceholder(event?.event));
  }, [event]);

  return { src, onError };
}

// ─── EventCard ───────────────────────────────────────────────────────────────

const EventCard = React.memo(({ event, index, onSelect }) => {
  const { src, onError } = useEventImage(event);
  const articleUrl = wikiUrl(event);

  return (
    <motion.div
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.8), duration: 0.4 }}
    >
      <div className="timeline-marker">
        <span>{event.year}</span>
      </div>

      {/* Clicking the card opens the detail modal */}
      <div
        className="timeline-card"
        onClick={() => onSelect(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(event)}
        aria-label={`View details for ${event.event}`}
      >
        {/* Image */}
        <div className="timeline-image-container">
          <img
            src={src}
            alt={`${event.event}, ${event.year}`}
            className="timeline-image"
            onError={onError}
            loading="lazy"
          />
          <div className="timeline-image-overlay">
            {event.region && (
              <span className="region-badge">
                <MapPinIcon className="icon-small" />
                {event.region}
              </span>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="timeline-card-content">
          <h3>{event.event}</h3>
          <p className="timeline-description">
            {event.description
              ? `${event.description.slice(0, 130)}…`
              : 'Click to view full details.'}
          </p>

          <div className="timeline-stats">
            {event.casualties && event.casualties !== 'N/A' && (
              <div className="timeline-stat">
                <UserGroupIcon className="icon-small" />
                <span>{String(event.casualties).split(',')[0]}</span>
              </div>
            )}
            <div className="timeline-stat">
              <CalendarIcon className="icon-small" />
              <span>{event.year}</span>
            </div>
          </div>

          {/*
            "Read More" is a real <a> tag — NOT a button.
            e.stopPropagation() prevents the card onClick (modal) from firing too.
            href points to the exact Wikipedia article via wikiSlug.
          */}
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-btn"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Read more about ${event.event} on Wikipedia`}
          >
            Read More on Wikipedia
            <ArrowTopRightOnSquareIcon className="icon-small" />
          </a>
        </div>
      </div>
    </motion.div>
  );
});

EventCard.displayName = 'EventCard';

// ─── EventModal ───────────────────────────────────────────────────────────────

const EventModal = ({ event, onClose }) => {
  const { src, onError } = useEventImage(event);
  const articleUrl = wikiUrl(event);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, y: 32 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 32 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-event-title"
      >
        {/* Close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <XMarkIcon className="icon" />
        </button>

        {/* Image */}
        <div className="modal-image-container">
          <img
            src={src}
            alt={`${event.event}, ${event.year}`}
            className="modal-image"
            onError={onError}
          />
          {event.imageCaption && (
            <div className="modal-image-caption">{event.imageCaption}</div>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          <h2 id="modal-event-title">{event.event}</h2>
          <p className="modal-year">{event.year}</p>

          {event.description && (
            <p className="modal-description">{event.description}</p>
          )}

          <div className="modal-details">
            {event.casualties && event.casualties !== 'N/A' && (
              <div className="modal-detail">
                <UserGroupIcon className="icon" />
                <div>
                  <h4>Casualties</h4>
                  <p>{event.casualties}</p>
                </div>
              </div>
            )}

            {event.region && (
              <div className="modal-detail">
                <MapPinIcon className="icon" />
                <div>
                  <h4>Region</h4>
                  <p>{event.region}</p>
                </div>
              </div>
            )}

            {event.significance && (
              <div className="modal-detail">
                <InformationCircleIcon className="icon" />
                <div>
                  <h4>Significance</h4>
                  <p>{event.significance}</p>
                </div>
              </div>
            )}
          </div>

          {/* Direct link to the exact Wikipedia article */}
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-link"
            aria-label={`Read full Wikipedia article about ${event.event}`}
          >
            Read Full Article on Wikipedia
            <ArrowTopRightOnSquareIcon className="icon-small" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

const Timeline = ({ events = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
<<<<<<< HEAD

  const regions = [
    'all',
    ...new Set(events.map((e) => e.region).filter(Boolean)),
  ];
=======
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  const regions = ['all', ...new Set(events.map(e => e.region).filter(Boolean))];
>>>>>>> 5b51205 (map updation)

  const visible =
    filter === 'all'
      ? events
      : events.filter((e) => e.region === filter);

<<<<<<< HEAD
  if (!events.length) {
    return (
      <div className="timeline-empty">
        <p>No events to display.</p>
      </div>
    );
  }

  return (
    <div className="timeline-wrapper">
      {/* Header */}
=======
  const handleImageError = (eventId) => {
    setImageErrors(prev => ({ ...prev, [eventId]: true }));
    setImageLoading(prev => ({ ...prev, [eventId]: false }));
  };

  const handleImageLoad = (eventId) => {
    setImageLoading(prev => ({ ...prev, [eventId]: false }));
  };

  const handleImageLoadStart = (eventId) => {
    setImageLoading(prev => ({ ...prev, [eventId]: true }));
  };

  // Generate SVG placeholder
  const getSvgPlaceholder = (event) => {
    const colors = {
      'Israel/Palestine': '#4f46e5',
      'Palestine': '#16a34a',
      'Iran': '#dc2626',
      'Iraq': '#b45309',
      'Syria': '#7c3aed',
      'Lebanon': '#0891b2',
      'Egypt': '#b45309',
      'Gaza': '#dc2626',
      'Multiple': '#8b5cf6',
      'default': '#4f46e5'
    };
    
    const color = colors[event.region] || colors.default;
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <rect width="800" height="400" fill="#1e293b"/>
      <rect x="300" y="120" width="200" height="100" rx="8" fill="${color}" opacity="0.2"/>
      <text x="400" y="180" font-family="Arial" font-size="28" fill="${color}" text-anchor="middle" font-weight="bold">${event.year}</text>
      <text x="400" y="240" font-family="Arial" font-size="16" fill="#94a3b8" text-anchor="middle" max-width="600">${event.event.substring(0, 40)}</text>
      <text x="400" y="280" font-family="Arial" font-size="14" fill="#64748b" text-anchor="middle">${event.region}</text>
    </svg>`;
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  // Get image with error handling
  const getEventImage = (event) => {
    const eventId = `${event.year}_${event.event}`;
    if (imageErrors[eventId]) {
      return getSvgPlaceholder(event);
    }
    return event.image;
  };

  return (
    <div className="timeline-wrapper">
      <style>{`
        .timeline-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .timeline-header h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #60a5fa, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .timeline-filters select {
          padding: 0.75rem 2rem 0.75rem 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          color: var(--text);
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }
        
        .timeline-filters select:hover {
          border-color: var(--primary);
        }
        
        .timeline-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--border), var(--primary), var(--border));
          transform: translateX(-50%);
        }
        
        .timeline-item {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .timeline-marker {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
        }
        
        .timeline-card {
          width: calc(50% - 3rem);
          margin: 3rem 0;
          background: var(--surface);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .timeline-item:nth-child(even) .timeline-card {
          margin-left: auto;
        }
        
        .timeline-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .timeline-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: var(--bg);
        }
        
        .timeline-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        
        .timeline-card:hover .timeline-image {
          transform: scale(1.05);
        }
        
        .timeline-image-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        
        .region-badge {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .timeline-card-content {
          padding: 1.5rem;
        }
        
        .timeline-card-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          color: var(--text);
        }
        
        .timeline-description {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0 0 1rem 0;
          line-height: 1.6;
        }
        
        .timeline-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .timeline-stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        
        .icon-small {
          width: 1rem;
          height: 1rem;
        }
        
        .read-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .read-more-btn:hover {
          background: var(--primary-dark);
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }
        
        .modal-content {
          background: var(--surface);
          border-radius: 1.5rem;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid var(--border);
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          z-index: 10;
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        
        .modal-close:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        
        .modal-image-container {
          width: 100%;
          height: 300px;
          overflow: hidden;
          position: relative;
          background: var(--bg);
        }
        
        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .modal-body {
          padding: 2rem;
        }
        
        .modal-body h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: var(--text);
        }
        
        .modal-year {
          font-size: 1rem;
          color: var(--primary);
          margin: 0 0 1rem 0;
        }
        
        .modal-description {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin: 0 0 2rem 0;
        }
        
        .modal-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .modal-detail {
          display: flex;
          gap: 0.75rem;
        }
        
        .modal-detail .icon {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--primary);
          flex-shrink: 0;
        }
        
        .modal-detail h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: var(--text);
        }
        
        .modal-detail p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin: 0;
        }
        
        .modal-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .modal-link:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }
        
        .image-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .timeline-container::before {
            left: 2rem;
          }
          
          .timeline-marker {
            left: 2rem;
            transform: translateX(0);
          }
          
          .timeline-card {
            width: calc(100% - 4rem);
            margin-left: 4rem !important;
          }
        }
      `}</style>

>>>>>>> 5b51205 (map updation)
      <div className="timeline-header">
        <h2>Middle East Conflict Timeline</h2>
        <div className="timeline-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="timeline-filter"
            aria-label="Filter events by region"
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All Regions' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="timeline-container">
<<<<<<< HEAD
        {visible.map((event, index) => (
          <EventCard
            key={`${event.year}_${event.event}`}
            event={event}
            index={index}
            onSelect={setSelectedEvent}
          />
        ))}
=======
        {filteredEvents.map((event, index) => {
          const eventId = `${event.year}_${event.event}`;
          const imageUrl = getEventImage(event);
          
          return (
            <motion.div 
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="timeline-marker">
                <span>{event.year}</span>
              </div>
              
              <div 
                className="timeline-card"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="timeline-image-container">
                  {imageLoading[eventId] && !imageErrors[eventId] && (
                    <div className="image-loading">
                      <PhotoIcon className="icon" style={{ width: '2rem', height: '2rem' }} />
                    </div>
                  )}
                  <img 
                    src={imageUrl} 
                    alt={event.event} 
                    className="timeline-image"
                    onError={() => handleImageError(eventId)}
                    onLoad={() => handleImageLoad(eventId)}
                    onLoadStart={() => handleImageLoadStart(eventId)}
                    loading="lazy"
                    style={{ 
                      opacity: imageLoading[eventId] && !imageErrors[eventId] ? 0 : 1
                    }}
                  />
                  <div className="timeline-image-overlay">
                    <span className="region-badge">
                      <MapPinIcon className="icon-small" />
                      {event.region}
                    </span>
                  </div>
                </div>
                
                <div className="timeline-card-content">
                  <h3>{event.event}</h3>
                  <p className="timeline-description">
                    {event.description.length > 120 
                      ? `${event.description.substring(0, 120)}...` 
                      : event.description}
                  </p>
                  
                  <div className="timeline-stats">
                    {event.casualties && event.casualties !== 'N/A' && (
                      <div className="timeline-stat">
                        <UserGroupIcon className="icon-small" />
                        <span>
                          {typeof event.casualties === 'string' 
                            ? event.casualties.split(' ')[0] 
                            : event.casualties}
                          {!event.casualties.includes('+') ? '+' : ''}
                        </span>
                      </div>
                    )}
                    
                    <div className="timeline-stat">
                      <CalendarIcon className="icon-small" />
                      <span>{event.year}</span>
                    </div>
                  </div>

                  <button className="read-more-btn">
                    Read More
                    <ArrowTopRightOnSquareIcon className="icon-small" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
>>>>>>> 5b51205 (map updation)
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
<<<<<<< HEAD
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
=======
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                <XMarkIcon className="icon" />
              </button>

              <div className="modal-image-container">
                <img 
                  src={getEventImage(selectedEvent)} 
                  alt={selectedEvent.event}
                  className="modal-image"
                  onError={() => handleImageError(`${selectedEvent.year}_${selectedEvent.event}`)}
                />
              </div>

              <div className="modal-body">
                <h2>{selectedEvent.event}</h2>
                <p className="modal-year">{selectedEvent.year}</p>
                <p className="modal-description">{selectedEvent.description}</p>

                <div className="modal-details">
                  {selectedEvent.casualties && selectedEvent.casualties !== 'N/A' && (
                    <div className="modal-detail">
                      <UserGroupIcon className="icon" />
                      <div>
                        <h4>Casualties</h4>
                        <p>{selectedEvent.casualties}</p>
                      </div>
                    </div>
                  )}

                  <div className="modal-detail">
                    <MapPinIcon className="icon" />
                    <div>
                      <h4>Region</h4>
                      <p>{selectedEvent.region}</p>
                    </div>
                  </div>

                  {selectedEvent.significance && (
                    <div className="modal-detail">
                      <CalendarIcon className="icon" />
                      <div>
                        <h4>Significance</h4>
                        <p>{selectedEvent.significance}</p>
                      </div>
                    </div>
                  )}
                </div>

                <a 
                  href={selectedEvent.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  Learn More on Wikipedia
                  <ArrowTopRightOnSquareIcon className="icon-small" />
                </a>
              </div>
            </motion.div>
          </motion.div>
>>>>>>> 5b51205 (map updation)
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;