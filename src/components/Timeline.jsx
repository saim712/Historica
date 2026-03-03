import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Timeline = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  const regions = ['all', ...new Set(events.map(e => e.region))];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.region === filter);

  const handleImageError = (eventId) => {
    setImageErrors(prev => ({ ...prev, [eventId]: true }));
  };

  const getImageUrl = (event) => {
    if (imageErrors[event.year + event.event]) {
      // Return conflict-appropriate placeholder based on event type
      const conflictImages = {
        '1948': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '1956': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '1967': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '1973': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '1979': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '1980': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '1982': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '1990': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '2003': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '2006': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '2008': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '2011': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '2014': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '2015': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '2017': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '2020': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop',
        '2021': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop',
        '2023': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&h=400&fit=crop',
        '2024': 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop'
      };
      return conflictImages[event.year.split('-')[0]] || 'https://images.unsplash.com/photo-1542810634-71277ad95d5d?w=600&h=400&fit=crop';
    }
    return event.image;
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-header">
        <h2>Middle East Conflict Timeline</h2>
        <div className="timeline-filters">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="timeline-filter"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="timeline-container">
        {filteredEvents.map((event, index) => (
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
                <img 
                  src={getImageUrl(event)} 
                  alt={event.event} 
                  className="timeline-image"
                  onError={() => handleImageError(event.year + event.event)}
                />
                <div className="timeline-image-overlay">
                  <span className="region-badge">{event.region}</span>
                </div>
              </div>
              
              <div className="timeline-card-content">
                <h3>{event.event}</h3>
                <p className="timeline-description">{event.description.substring(0, 100)}...</p>
                
                <div className="timeline-stats">
                  {event.casualties && event.casualties !== 'N/A' && (
                    <div className="timeline-stat">
                      <UserGroupIcon className="icon-small" />
                      <span>{typeof event.casualties === 'string' ? event.casualties.split(' ')[0] : event.casualties}+</span>
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
        ))}
      </div>

      <AnimatePresence>
        {selectedEvent && (
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
                  src={getImageUrl(selectedEvent)} 
                  alt={selectedEvent.event}
                  className="modal-image"
                  onError={() => handleImageError(selectedEvent.year + selectedEvent.event)}
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;