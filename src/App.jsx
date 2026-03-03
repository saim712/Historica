import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { fetchNews, fetchMilitaryBases, fetchHistoricalEvents } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

// Components
import NewsFeed from './components/NewsFeed.jsx';
import MilitaryMap from './components/MilitaryMap.jsx';
import Timeline from './components/Timeline.jsx';
import Statistics from './components/Statistics.jsx';
import Analytics from './components/Analytics.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';

// Icons
import { 
  HomeIcon, 
  NewspaperIcon, 
  MapIcon, 
  ClockIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

function App() {
  const location = useLocation();
  const [news, setNews] = useState({ articles: [], source: null });
  const [bases, setBases] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllData = useCallback(async () => {
    setLoading(true);
    
    try {
      const [newsData, basesData, historyData] = await Promise.all([
        fetchNews(),
        fetchMilitaryBases(),
        fetchHistoricalEvents()
      ]);
      
      setNews({
        articles: newsData.articles || [],
        source: newsData.source || 'NewsAPI'
      });
      setBases(basesData);
      setHistory(historyData);
      setLastUpdate(new Date());
      
      toast.success('Data updated successfully!', {
        icon: '🔄',
        duration: 3000
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to update data. Retrying...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await loadAllData();
      }
    };
    
    fetchData();
    
    const intervalId = setInterval(() => {
      if (isMounted) {
        loadAllData();
      }
    }, 300000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [loadAllData]);

  // Filter news based on category and search
  const filteredNews = news.articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || 
      (article.title + article.description).toLowerCase().includes(selectedCategory);
    
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'News Feed', href: '/news', icon: NewspaperIcon },
    { name: 'Military Map', href: '/map', icon: MapIcon },
    { name: 'Timeline', href: '/history', icon: ClockIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ];

  return (
    <div className="app-wrapper">
      <Toaster position="top-right" />
      
      <Sidebar 
        navigation={navigation} 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        news={news.articles}
      />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header 
          lastUpdate={lastUpdate}
          loading={loading}
          onRefresh={loadAllData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={
                  <div className="dashboard">
                    {/* Hero Section */}
                    <motion.div 
                      className="hero-section"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h1 className="hero-title">
                        Middle East Intelligence Dashboard
                      </h1>
                      <p className="hero-subtitle">
                        Real-time monitoring of geopolitical events, military movements, and regional developments
                      </p>
                      <div className="hero-stats">
                        <div className="hero-stat">
                          <span className="hero-stat-value">{news.articles.length}</span>
                          <span className="hero-stat-label">Articles Today</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">{bases.length}</span>
                          <span className="hero-stat-label">Military Bases</span>
                        </div>
                        <div className="hero-stat">
                          <span className="hero-stat-value">{history.length}</span>
                          <span className="hero-stat-label">Historical Events</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <Statistics news={news.articles} />
                    
                    {/* Featured News */}
                    <motion.section 
                      className="featured-section"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="section-header">
                        <h2>📰 Breaking News</h2>
                        <Link to="/news" className="view-all-link">
                          View All <span>→</span>
                        </Link>
                      </div>
                      <NewsFeed 
                        news={filteredNews.slice(0, 6)} 
                        loading={loading} 
                      />
                    </motion.section>

                    {/* Quick Map Preview */}
                    <motion.section 
                      className="map-preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="section-header">
                        <h2>📍 Active Military Bases</h2>
                        <Link to="/map" className="view-all-link">
                          View Full Map <span>→</span>
                        </Link>
                      </div>
                      <div className="map-preview-container">
                        <MilitaryMap bases={bases} preview={true} />
                      </div>
                    </motion.section>
                  </div>
                } />
                
                <Route path="/news" element={
                  <div className="news-page">
                    <div className="page-header">
                      <h1>Live News Feed</h1>
                      <p>Real-time updates from global news sources</p>
                    </div>
                    <NewsFeed news={filteredNews} loading={loading} />
                  </div>
                } />
                
                <Route path="/map" element={
                  <div className="map-page">
                    <div className="page-header">
                      <h1>Military Installations Map</h1>
                      <p>Interactive map of military bases and conflict zones</p>
                    </div>
                    <MilitaryMap bases={bases} />
                  </div>
                } />
                
                <Route path="/history" element={
                  <div className="history-page">
                    <div className="page-header">
                      <h1>Historical Timeline</h1>
                      <p>Key events in Middle East history</p>
                    </div>
                    <Timeline events={history} />
                  </div>
                } />
                
                <Route path="/analytics" element={
                  <div className="analytics-page">
                    <div className="page-header">
                      <h1>Analytics & Insights</h1>
                      <p>Data-driven analysis of regional trends</p>
                    </div>
                    <Analytics news={news.articles} bases={bases} history={history} />
                  </div>
                } />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer with Source Info */}
        <footer className="footer">
          <p>Data updates every 4 hours</p>
          {news.source && (
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.8rem', 
              color: 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <span>Data source:</span>
              <span style={{
                background: news.source === 'Fallback' ? 'var(--warning)' : 'var(--success)',
                color: 'white',
                padding: '0.2rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                {news.source === 'Fallback' ? '📢 Demo Data' : '📡 Live NewsAPI'}
              </span>
              {lastUpdate && (
                <span>• Last updated: {lastUpdate.toLocaleTimeString()}</span>
              )}
            </div>
          )}
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>© 2026 Historical News Monitor</p>
        </footer>
      </div>
    </div>
  );
}

export default App;