import React from 'react';
import './SensorCard.scss';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';

interface SensorCardProps {
  sensor: ZontSensor;
  min?: number;
  max?: number;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor, min, max }) => {
  const isOutOfRange =
    min !== undefined &&
    max !== undefined &&
    sensor.value !== undefined &&
    (sensor.value < min || sensor.value > max);

  return (
    <div className="sensor-card">
      <div className="range-indicator">
        <span>{min ?? '-'}</span>
        <span>{max ?? '-'}</span>
      </div>
      <div className="value-container">
        <span style={{ color: isOutOfRange ? 'red' : '#333' }}>
          {sensor.value ?? '-'} {sensor.unit ?? ''}
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
