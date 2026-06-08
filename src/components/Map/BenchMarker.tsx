import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Check } from 'lucide-react';
import type { Bench } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import { TAG_ICONS } from '../../types/bench';

interface BenchMarkerProps {
  bench: Bench;
  index: number;
}

const createBenchIcon = (tags: string[], isSelected: boolean, compareMode: boolean) => {
  const primaryTag = tags[0] || '';
  const iconEmoji = TAG_ICONS[primaryTag as keyof typeof TAG_ICONS] || '🪑';
  
  const bgGradient = isSelected 
    ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
    : 'linear-gradient(135deg, #F59E0B, #EA580C)';
  const shadowColor = isSelected 
    ? 'rgba(139, 92, 246, 0.4)' 
    : 'rgba(249, 115, 22, 0.4)';
  const pulseBg = isSelected 
    ? 'rgba(139, 92, 246, 0.3)' 
    : 'rgba(249, 115, 22, 0.3)';
  const borderColor = isSelected ? '#4C1D95' : 'white';
  
  return L.divIcon({
    className: 'custom-bench-marker',
    html: `
      <div class="bench-marker-wrapper" style="
        width: 48px;
        height: 48px;
        position: relative;
        animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        opacity: 0;
      ">
        <div class="bench-marker-shadow" style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 8px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(3px);
        "></div>
        <div class="bench-marker-content" style="
          width: 40px;
          height: 40px;
          background: ${bgGradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${shadowColor};
          border: 3px solid ${borderColor};
          font-size: 20px;
          position: relative;
          z-index: 1;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
          ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color:white;"><polyline points="20 6 9 17 4 12"></polyline></svg>' : iconEmoji}
        </div>
        ${!isSelected || !compareMode ? `
        <div class="bench-marker-pulse" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: ${pulseBg};
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        "></div>
        ` : ''}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 40],
    popupAnchor: [0, -35],
  });
};

const createPendingIcon = () => {
  return L.divIcon({
    className: 'pending-marker',
    html: `
      <div style="
        width: 56px;
        height: 56px;
        position: relative;
        animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      ">
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 8px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(3px);
        "></div>
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          border: 3px dashed white;
          font-size: 24px;
          position: relative;
          z-index: 1;
          animation: spin 3s linear infinite;
        ">
          ➕
        </div>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 45],
  });
};

export default function BenchMarker({ bench, index }: BenchMarkerProps) {
  const { selectBench, compareMode, compareBenchIds, toggleCompareBench } = useBenchStore();
  const isSelected = compareBenchIds.includes(bench.id);
  const icon = createBenchIcon(bench.tags, isSelected, compareMode);

  const handleClick = () => {
    if (compareMode) {
      toggleCompareBench(bench.id);
    } else {
      selectBench(bench);
    }
  };

  return (
    <Marker
      position={[bench.lat, bench.lng]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup
        closeButton={false}
        className="bench-popup"
        offset={[0, -5]}
      >
        <div
          className="p-3 min-w-[200px]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {bench.name}
            </h4>
            <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCompareBench(bench.id)}
                className="w-4 h-4 accent-violet-500 rounded"
              />
            </label>
          </div>
          <p className="text-xs text-stone-500 mb-2">{bench.location}</p>
          <div className="flex flex-wrap gap-1">
            {bench.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
              >
                {TAG_ICONS[tag]} {tag}
              </span>
            ))}
          </div>
          {compareMode && (
            <div className="mt-2 pt-2 border-t border-stone-100">
              <span className={`text-xs ${
                isSelected 
                  ? 'text-violet-600 font-medium' 
                  : 'text-stone-400'
              }`}>
                {isSelected ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    已加入对比
                  </span>
                ) : (
                  '点击标记加入对比'
                )}
              </span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export function PendingMarker() {
  const { pendingLocation } = useBenchStore();

  if (!pendingLocation) return null;

  return (
    <Marker
      position={[pendingLocation.lat, pendingLocation.lng]}
      icon={createPendingIcon()}
    />
  );
}
