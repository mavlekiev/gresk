import React from 'react';
import './SensorCard.scss';
import type { ZontSensor } from '../../utils/interfaces/zont-devices.interface';

interface SensorCardProps {
  sensor: ZontSensor;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const hasTriggered = sensor.triggered === true;

  return (
    <div className="sensor-card">
      <div className="value-container">
        <span style={{ color: hasTriggered ? 'red' : '#333' }}>
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
