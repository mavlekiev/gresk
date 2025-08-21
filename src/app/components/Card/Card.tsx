import React from 'react';
import './Card.scss';

interface CardProps {
  title: string;
  online: boolean;
  sensors: Array<{
    name: string;
    value?: number;
    unit?: string;
    triggered?: boolean;
  }>;
}

const Card: React.FC<CardProps> = ({ title, online, sensors }) => {
  const status = online
    ? { icon: '🟢', label: 'На связи' }
    : { icon: '🔴', label: 'Оффлайн' };

  return (
    <div className={`card ${!online ? 'card--offline' : ''}`}>
      <div className="card__header">
        <h3>{title}</h3>
        <span className="status-icon" title={status.label}>
          {status.icon}
        </span>
      </div>
      <div className="card__sensors">
        {sensors.length > 0 ? (
          sensors.map((sensor, index) => (
            <div
              key={index}
              className="sensor"
              style={{ color: sensor.triggered ? 'red' : '#333' }}
            >
              <div>
                <div className="sensor__value">
                  {sensor.value ?? '—'} {sensor.unit ?? ''}
                </div>
                <div className="sensor__label">{sensor.name}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="sensor sensor--empty">—</div>
        )}
      </div>
      {!online && (
        <div className="card__offline-badge">Оффлайн (посл. данные)</div>
      )}
    </div>
  );
};

export default Card;
