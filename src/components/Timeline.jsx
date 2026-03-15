import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  InformationCircleIcon,
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

  const regions = [
    'all',
    ...new Set(events.map((e) => e.region).filter(Boolean)),
  ];

  const visible =
    filter === 'all'
      ? events
      : events.filter((e) => e.region === filter);

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
        {visible.map((event, index) => (
          <EventCard
            key={`${event.year}_${event.event}`}
            event={event}
            index={index}
            onSelect={setSelectedEvent}
          />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;