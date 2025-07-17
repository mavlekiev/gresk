import React from 'react';
import './SensorCard.scss';

interface SensorCardProps {
  sensor: ZontSensor;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const isOutOfRange =
    sensor.min !== undefined &&
    sensor.max !== undefined &&
    (sensor.value < sensor.min || sensor.value > sensor.max);

  return (
    <div className="sensor-card">
      <div className="range-indicator">
        <span>{sensor.min ?? '-'}</span>
        <span>{sensor.max ?? '-'}</span>
      </div>
      <div className="value-container">
        <span style={{ color: isOutOfRange ? 'red' : '#333' }}>
          {sensor.value} {sensor.unit}
        </span>
        <p>{sensor.name}</p>
      </div>
      <div className="settings-icon">
        <i className="fas fa-cog"></i>
      </div>
    </div>
  );
};

export default SensorCard;
