import React from 'react';

const Statistics = ({ news }) => {
  const categories = {
    military: 0,
    casualties: 0,
    diplomacy: 0,
    conflict: 0,
    other: 0
  };

  news.forEach(article => {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    if (text.includes('military') || text.includes('base') || text.includes('troop')) 
      categories.military++;
    else if (text.includes('kill') || text.includes('death') || text.includes('casualty')) 
      categories.casualties++;
    else if (text.includes('peace') || text.includes('talk') || text.includes('negotiat')) 
      categories.diplomacy++;
    else if (text.includes('attack') || text.includes('strike') || text.includes('war')) 
      categories.conflict++;
    else 
      categories.other++;
  });

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Articles</h3>
        <p className="stat-number">{news.length}</p>
      </div>
      <div className="stat-card" style={{ background: '#c62828', color: 'white' }}>
        <h3>Military</h3>
        <p className="stat-number">{categories.military}</p>
      </div>
      <div className="stat-card" style={{ background: '#f9a825', color: 'white' }}>
        <h3>Casualties</h3>
        <p className="stat-number">{categories.casualties}</p>
      </div>
      <div className="stat-card" style={{ background: '#2e7d32', color: 'white' }}>
        <h3>Diplomacy</h3>
        <p className="stat-number">{categories.diplomacy}</p>
      </div>
      <div className="stat-card" style={{ background: '#1a237e', color: 'white' }}>
        <h3>Conflict</h3>
        <p className="stat-number">{categories.conflict}</p>
      </div>
    </div>
  );
};

export default Statistics;