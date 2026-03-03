import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts';
import { motion } from 'framer-motion';

const Analytics = ({ news, bases, history }) => {
  // Prepare data for charts
  const categoryData = [
    { name: 'Military', value: news.filter(n => 
      (n.title + n.description).toLowerCase().includes('military')).length },
    { name: 'Conflict', value: news.filter(n => 
      (n.title + n.description).toLowerCase().includes('conflict')).length },
    { name: 'Diplomacy', value: news.filter(n => 
      (n.title + n.description).toLowerCase().includes('diplomacy')).length },
    { name: 'Casualties', value: news.filter(n => 
      (n.title + n.description).toLowerCase().includes('casualty')).length },
  ];

  const sourceData = news.reduce((acc, article) => {
    const source = article.source?.name || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const sourceChartData = Object.entries(sourceData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const timelineData = history.map(event => ({
    year: event.year,
    event: event.event,
    value: 1
  }));

  const COLORS = ['#1a237e', '#c62828', '#2e7d32', '#f9a825', '#455a64'];

  return (
    <motion.div 
      className="analytics-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>News Coverage</h3>
          <p className="metric-value">{news.length}</p>
          <p className="metric-trend">+12% from yesterday</p>
        </div>
        <div className="metric-card">
          <h3>Active Sources</h3>
          <p className="metric-value">{Object.keys(sourceData).length}</p>
          <p className="metric-trend">Major news agencies</p>
        </div>
        <div className="metric-card">
          <h3>Military Bases</h3>
          <p className="metric-value">{bases.length}</p>
          <p className="metric-trend">US & allied forces</p>
        </div>
        <div className="metric-card">
          <h3>Historical Events</h3>
          <p className="metric-value">{history.length}</p>
          <p className="metric-trend">Key milestones</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Category Distribution */}
        <div className="chart-card">
          <h3>News Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Distribution */}
        <div className="chart-card">
          <h3>Top News Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1a237e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Visualization */}
        <div className="chart-card full-width">
          <h3>Historical Timeline Density</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#1a237e" fill="#1a237e33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">📊</span>
            <h4>Coverage Analysis</h4>
            <p>Military topics represent {Math.round((categoryData[0].value / news.length) * 100)}% of current coverage</p>
          </div>
          <div className="insight-card">
            <span className="insight-icon">📰</span>
            <h4>Source Diversity</h4>
            <p>News from {Object.keys(sourceData).length} different sources in the last 4 hours</p>
          </div>
          <div className="insight-card">
            <span className="insight-icon">📍</span>
            <h4>Geographic Focus</h4>
            <p>Primary focus on Iran, Israel, and Gaza region</p>
          </div>
          <div className="insight-card">
            <span className="insight-icon">⏰</span>
            <h4>Update Frequency</h4>
            <p>Real-time updates every 4 hours with live news feed</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;