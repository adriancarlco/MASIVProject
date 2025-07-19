import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GridHelper } from 'three';
import { fetchMapData } from '../api.js';

function lonLatToXZ(lon, lat, originLon, originLat) {
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = 111320 * Math.cos(originLat * Math.PI / 180);
  const scale = 100;
  const x = (lon - originLon) * metersPerDegreeLon / scale;
  const z = (lat - originLat) * metersPerDegreeLat / scale;
  return [x, -z];
}

function getColorByHeight(height) {
  if (height < 15) return '#48F802';    // green
  if (height < 30) return '#F9F502';    // purple
  if (height < 50) return '#60A5FA';    // blue
  if (height < 80) return '#FBBF24';   // yellow
  return '#EF4444';                     // red
}

function lightenColor(hex, amount = 0.8) {
  let col = hex.replace('#', '');
  if (col.length === 3) col = col.split('').map(c => c + c).join('');
  const num = parseInt(col, 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (num & 0xff) + 255 * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function Ground({ size = 1000 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#ddd" />
    </mesh>
  );
}

function Building({ coords, height, info, isHighlighted, onHover, onLeave }) {
  const [x, z] = coords;
  const [hovered, setHovered] = useState(false);

  const baseColor = getColorByHeight(height);
  const hoverColor = lightenColor(baseColor);
  const highlightColor = '#00FFFF'; // cyan highlight for matching filters

  return (
    <mesh
      position={[x, height / 2, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onLeave();
      }}
    >
      <cylinderGeometry args={[2, 2, height, 8]} />
      <meshStandardMaterial color={isHighlighted ? highlightColor : (hovered ? hoverColor : baseColor)} />
    </mesh>
  );
}

export default function MapView({ filters }) {
  const [buildings, setBuildings] = useState([]);
  const [hoveredInfo, setHoveredInfo] = useState(null);

  useEffect(() => {
    fetchMapData().then((res) => setBuildings(res.data));
  }, []);

  const globalOrigin =
    buildings.find(b => Array.isArray(b.coordinates) && b.coordinates.length === 2)?.coordinates
    || [-114.0719, 51.0447];

  const HEIGHT_SCALE = 0.5;

  const isMatch = (b) => {
    if (!filters || !filters.attribute) return false;
    const val = b[filters.attribute];
    const compare = parseFloat(filters.value);
    switch (filters.operator) {
      case '>': return val > compare;
      case '<': return val < compare;
      case '=': return val === compare;
      case 'contains': return (val || '').toString().includes(filters.value);
      default: return false;
    }
  };

  return (
    <div style={{ width: '90vw', height: '90vh', margin: '5vh auto', border: '4px solid #333', borderRadius: '10px', backgroundColor: '#f4f4f4', boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
      <Canvas camera={{ position: [200, 300, 400], fov: 45 }} shadows gl={{ preserveDrawingBuffer: true, alpha: false }} style={{ background: '#f4f4f4' }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[100, 200, 100]} intensity={0.8} castShadow />
        <OrbitControls target={[0, 50, 0]} />
        <primitive object={new GridHelper(1000, 100)} />
        <Ground />

        {buildings.map((b, i) => {
          const isValid = Array.isArray(b.coordinates) && b.coordinates.length === 2 && typeof b.height === 'number';
          if (!isValid) return null;

          const [x, z] = lonLatToXZ(b.coordinates[0], b.coordinates[1], globalOrigin[0], globalOrigin[1]);
          const rawHeight = b.height;
          const scaledHeight = Math.min(rawHeight * HEIGHT_SCALE, 100);

          return (
            //Initalizes the properties of each bu9ilding and also checks if it is highlighted to see if it is a match for the query
            <Building
              key={i}
              coords={[x, z]}
              height={scaledHeight}
              info={b}
              isHighlighted={isMatch(b)}
              onHover={() => setHoveredInfo({ coordinates: b.coordinates, height: scaledHeight, construction_year: b.construction_year })}
              onLeave={() => setHoveredInfo(null)}
            />
          );
        })}
      </Canvas>

      {hoveredInfo && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'white', padding: '10px 14px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', fontSize: '14px', zIndex: 10 }}>
          <div><strong>Coordinates:</strong> [{hoveredInfo.coordinates[0].toFixed(2)}, {hoveredInfo.coordinates[1].toFixed(2)}]</div>
          <div><strong>Height:</strong> {hoveredInfo.height.toFixed(1)}</div>
          <div><strong>Year:</strong> {hoveredInfo.construction_year || 'N/A'}</div>
        </div>
      )}

          {/* 🔍 LEGEND */}
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '10px 14px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      fontSize: '13px',
      lineHeight: '1.6',
      zIndex: 10
    }}>
      <div><strong>Legend</strong></div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#48F802', marginRight: '6px' }}></span>Height &lt; 15</div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#F9F502', marginRight: '6px' }}></span>15 ≤ Height &lt; 30</div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#60A5FA', marginRight: '6px' }}></span>30 ≤ Height &lt; 50</div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#FBBF24', marginRight: '6px' }}></span>50 ≤ Height &lt; 80</div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#EF4444', marginRight: '6px' }}></span>Height ≥ 80</div>
      <div><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#00FFFF', marginRight: '6px' }}></span>Filtered Match</div>
    </div>
    
    </div>

  );
}
