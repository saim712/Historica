// import React, { useState, useEffect, useCallback } from 'react';
// import { Routes, Route, Link, useLocation } from 'react-router-dom';
// import { fetchNews, fetchMilitaryBases, fetchHistoricalEvents } from './services/api';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Toaster, toast } from 'react-hot-toast';
// import './App.css';

// // Components
// import NewsFeed from './components/NewsFeed.jsx';
// import MilitaryMap from './components/MilitaryMap.jsx';
// import Timeline from './components/Timeline.jsx';
// import Statistics from './components/Statistics.jsx';
// import Analytics from './components/Analytics.jsx';
// import Sidebar from './components/Sidebar.jsx';
// import Header from './components/Header.jsx';

// // Icons
// import { 
//   HomeIcon, 
//   NewspaperIcon, 
//   MapIcon, 
//   ClockIcon, 
//   ChartBarIcon 
// } from '@heroicons/react/24/outline';

// function App() {
//   const location = useLocation();
//   const [news, setNews] = useState({ articles: [], source: null });
//   const [bases, setBases] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   const loadAllData = useCallback(async () => {
//     setLoading(true);
    
//     try {
//       const [newsData, basesData, historyData] = await Promise.all([
//         fetchNews(),
//         fetchMilitaryBases(),
//         fetchHistoricalEvents()
//       ]);
      
//       setNews({
//         articles: newsData.articles || [],
//         source: newsData.source || 'NewsAPI'
//       });
//       setBases(basesData);
//       setHistory(historyData);
//       setLastUpdate(new Date());
      
//       toast.success('Data updated successfully!', {
//         icon: '🔄',
//         duration: 3000
//       });
//     } catch (error) {
//       console.error('Error loading data:', error);
//       toast.error('Failed to update data. Retrying...');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
    
//     const fetchData = async () => {
//       if (isMounted) {
//         await loadAllData();
//       }
//     };
    
//     fetchData();
    
//     const intervalId = setInterval(() => {
//       if (isMounted) {
//         loadAllData();
//       }
//     }, 300000);
    
//     return () => {
//       isMounted = false;
//       clearInterval(intervalId);
//     };
//   }, [loadAllData]);

//   // Filter news based on category and search
//   const filteredNews = news.articles.filter(article => {
//     const matchesCategory = selectedCategory === 'all' || 
//       (article.title + article.description).toLowerCase().includes(selectedCategory);
    
//     const matchesSearch = searchQuery === '' ||
//       article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     return matchesCategory && matchesSearch;
//   });

//   const navigation = [
//     { name: 'Dashboard', href: '/', icon: HomeIcon },
//     { name: 'News Feed', href: '/news', icon: NewspaperIcon },
//     { name: 'Military Map', href: '/map', icon: MapIcon },
//     { name: 'Timeline', href: '/history', icon: ClockIcon },
//     { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
//   ];

//   return (
//     <div className="app-wrapper">
//       <Toaster position="top-right" />
      
//       <Sidebar 
//         navigation={navigation} 
//         open={sidebarOpen} 
//         setOpen={setSidebarOpen}
//         news={news.articles}
//       />
      
//       <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <Header 
//           lastUpdate={lastUpdate}
//           loading={loading}
//           onRefresh={loadAllData}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//           setSidebarOpen={setSidebarOpen}
//         />
        
//         <main className="content-area">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Routes>
//                 <Route path="/" element={
//                   <div className="dashboard">
//                     {/* Hero Section */}
//                     <motion.div 
//                       className="hero-section"
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: 0.1 }}
//                     >
//                       <h1 className="hero-title">
//                         Middle East Intelligence Dashboard
//                       </h1>
//                       <p className="hero-subtitle">
//                         Real-time monitoring of geopolitical events, military movements, and regional developments
//                       </p>
//                       <div className="hero-stats">
//                         <div className="hero-stat">
//                           <span className="hero-stat-value">{news.articles.length}</span>
//                           <span className="hero-stat-label">Articles Today</span>
//                         </div>
//                         <div className="hero-stat">
//                           <span className="hero-stat-value">{bases.length}</span>
//                           <span className="hero-stat-label">Military Bases</span>
//                         </div>
//                         <div className="hero-stat">
//                           <span className="hero-stat-value">{history.length}</span>
//                           <span className="hero-stat-label">Historical Events</span>
//                         </div>
//                       </div>
//                     </motion.div>

//                     {/* Statistics Cards */}
//                     <Statistics news={news.articles} />
                    
//                     {/* Featured News */}
//                     <motion.section 
//                       className="featured-section"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.2 }}
//                     >
//                       <div className="section-header">
//                         <h2>📰 Breaking News</h2>
//                         <Link to="/news" className="view-all-link">
//                           View All <span>→</span>
//                         </Link>
//                       </div>
//                       <NewsFeed 
//                         news={filteredNews.slice(0, 6)} 
//                         loading={loading} 
//                       />
//                     </motion.section>

//                     {/* Quick Map Preview */}
//                     <motion.section 
//                       className="map-preview"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.3 }}
//                     >
//                       <div className="section-header">
//                         <h2>📍 Active Military Bases</h2>
//                         <Link to="/map" className="view-all-link">
//                           View Full Map <span>→</span>
//                         </Link>
//                       </div>
//                       <div className="map-preview-container">
//                         <MilitaryMap bases={bases} preview={true} />
//                       </div>
//                     </motion.section>
//                   </div>
//                 } />
                
//                 <Route path="/news" element={
//                   <div className="news-page">
//                     <div className="page-header">
//                       <h1>Live News Feed</h1>
//                       <p>Real-time updates from global news sources</p>
//                     </div>
//                     <NewsFeed news={filteredNews} loading={loading} />
//                   </div>
//                 } />
                
//                 <Route path="/map" element={
//                   <div className="map-page">
//                     <div className="page-header">
//                       <h1>Military Installations Map</h1>
//                       <p>Interactive map of military bases and conflict zones</p>
//                     </div>
//                     <MilitaryMap bases={bases} />
//                   </div>
//                 } />
                
//                 <Route path="/history" element={
//                   <div className="history-page">
//                     <div className="page-header">
//                       <h1>Historical Timeline</h1>
//                       <p>Key events in Middle East history</p>
//                     </div>
//                     <Timeline events={history} />
//                   </div>
//                 } />
                
//                 <Route path="/analytics" element={
//                   <div className="analytics-page">
//                     <div className="page-header">
//                       <h1>Analytics & Insights</h1>
//                       <p>Data-driven analysis of regional trends</p>
//                     </div>
//                     <Analytics news={news.articles} bases={bases} history={history} />
//                   </div>
//                 } />
//               </Routes>
//             </motion.div>
//           </AnimatePresence>
//         </main>

//         {/* Footer with Source Info */}
//         <footer className="footer">
//           <p>Data updates every 4 hours</p>
//           {news.source && (
//             <div style={{ 
//               marginTop: '0.5rem', 
//               fontSize: '0.8rem', 
//               color: 'var(--gray)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '0.5rem'
//             }}>
//               <span>Data source:</span>
//               <span style={{
//                 background: news.source === 'Fallback' ? 'var(--warning)' : 'var(--success)',
//                 color: 'white',
//                 padding: '0.2rem 0.8rem',
//                 borderRadius: '20px',
//                 fontSize: '0.7rem',
//                 fontWeight: '600'
//               }}>
//                 {news.source === 'Fallback' ? '📢 Demo Data' : '📡 Live NewsAPI'}
//               </span>
//               {lastUpdate && (
//                 <span>• Last updated: {lastUpdate.toLocaleTimeString()}</span>
//               )}
//             </div>
//           )}
//           <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>© 2026 Historical News Monitor</p>
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default App;




























import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { fetchNews, fetchMilitaryBases, fetchHistoricalEvents } from './services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

// Components
import NewsFeed from './components/NewsFeed';
import MilitaryMap from './components/MilitaryMap';
import Timeline from './components/Timeline';
import Statistics from './components/Statistics';
import Analytics from './components/Analytics';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Icons
import { 
  HomeIcon, 
  NewspaperIcon, 
  MapIcon, 
  ClockIcon, 
  ChartBarIcon,
  ArrowPathIcon
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
        duration: 3000,
        style: {
          background: '#10b981',
          color: 'white',
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to update data. Retrying...', {
        icon: '⚠️',
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
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
    }, 300000); // 5 minutes
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [loadAllData]);

  // Filter news based on category and search
  const filteredNews = news.articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || 
      (article.category?.name?.toLowerCase() || '').includes(selectedCategory.toLowerCase()) ||
      (article.title + article.description).toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.region && article.region.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
      <style>{`
        .app-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        :root {
          --bg: #0f172a;
          --surface: #1e293b;
          --surface-light: #334155;
          --primary: #3b82f6;
          --primary-dark: #2563eb;
          --primary-light: #60a5fa;
          --secondary: #8b5cf6;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --text: #f1f5f9;
          --text-muted: #94a3b8;
          --border: #334155;
          --border-light: #475569;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .main-content.sidebar-open {
          margin-left: 280px;
        }

        .main-content.sidebar-closed {
          margin-left: 80px;
        }

        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* Dashboard Styles */
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-section {
          background: linear-gradient(135deg, var(--surface) 0%, var(--surface-light) 100%);
          border-radius: 1.5rem;
          padding: 3rem;
          margin-bottom: 2rem;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          animation: pulse 10s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin: 0 0 2rem 0;
          max-width: 600px;
          position: relative;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          position: relative;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
        }

        .hero-stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .hero-stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--text);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: gap 0.2s;
        }

        .view-all-link:hover {
          gap: 0.75rem;
          color: var(--primary-light);
        }

        .featured-section,
        .map-preview {
          margin-bottom: 2rem;
        }

        .map-preview-container {
          background: var(--surface);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          height: 400px;
        }

        /* Page Headers */
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-header p {
          font-size: 1rem;
          color: var(--text-muted);
          margin: 0;
        }

        /* Footer */
        .footer {
          padding: 1.5rem 2rem;
          text-align: center;
          border-top: 1px solid var(--border);
          background: var(--surface);
        }

        .footer p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        /* Loading State */
        .global-loading {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .global-loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(59, 130, 246, 0.1);
          border-left-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .global-loading p {
          color: var(--text);
          font-size: 1.1rem;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-content.sidebar-open,
          .main-content.sidebar-closed {
            margin-left: 0;
          }

          .content-area {
            padding: 1rem;
          }

          .hero-section {
            padding: 2rem;
          }

          .hero-title {
            font-size: 1.8rem;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
          }

          .map-preview-container {
            height: 300px;
          }
        }

        /* Animations */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--surface);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--border-light);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
          },
        }}
      />
      
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
          <p>Data updates every 5 minutes</p>
          {news.source && (
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
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
              <button
                onClick={loadAllData}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                }}
              >
                <ArrowPathIcon className={`icon-small ${loading ? 'spinning' : ''}`} />
                Refresh
              </button>
            </div>
          )}
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>© 2026 Middle East Intelligence Dashboard</p>
        </footer>
      </div>

      {/* Global Loading Overlay */}
      {loading && news.articles.length === 0 && (
        <div className="global-loading">
          <div className="global-loading-spinner"></div>
          <p>Loading intelligence data...</p>
        </div>
      )}
    </div>
  );
}

export default App;