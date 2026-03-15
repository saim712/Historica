import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet (Vite version)
delete L.Icon.Default.prototype._getIconUrl;

// Import images directly (Vite way)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const MilitaryMap = ({ bases }) => {
  // Center on Middle East
  const position = [31.0461, 34.8516]; // Gaza coordinates

  return (
    <div className="map-container">
      <MapContainer 
        center={position} 
        zoom={5} 
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {bases && bases.map((base, index) => (
          <Marker key={index} position={[base.lat, base.lng]}>
            <Popup>
              <strong>{base.name}</strong><br/>
              Country: {base.country}<br/>
              Operated by: {base.operatedBy || 'US'}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="map-legend" style={{ background: 'white', padding: '12px' }}>
  <h3 style={{ color: '#111', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
    📍 US Military Bases in the Region
  </h3>
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {bases && bases.map((base, index) => (
      <li key={index} style={{ color: '#222', fontSize: '14px', padding: '4px 0' }}>
        {base.name} - {base.country}
      </li>
    ))}
  </ul>
</div>
    </div>
  );
};

export default MilitaryMap;