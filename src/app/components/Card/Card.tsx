import React, { useEffect } from 'react';
import './Card.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import {
  DEVICE_NAME_MAP,
  SENSOR_NAME_MAP,
  SENSOR_THRESHOLDS,
} from '../../utils/const/const';

interface CardProps {
  device: ZontDevice;
  title: string;
  type: 'teplo' | 'vzu';
  sensors: Array<{
    name: string;
    value?: number;
    unit?: string;
    triggered?: boolean;
  }>;
  ranges: Record<string, { min?: number; max?: number }>;
}

const Card: React.FC<CardProps> = ({
  device,
  title,
  type,
  sensors,
  ranges,
}) => {
  const getDeviceStatus = () => {
    return device.online
      ? { icon: '🟢', label: 'На связи' }
      : { icon: '🔴', label: 'Оффлайн' };
  };

  const status = getDeviceStatus();

  const shouldBlink = sensors.some((sensor) => {
    const originalDeviceName =
      Object.keys(SENSOR_THRESHOLDS).find(
        (key) => DEVICE_NAME_MAP[key] === title
      ) || device.name.trim();

    const thresholds = SENSOR_THRESHOLDS[originalDeviceName];
    if (!thresholds) return false;

    const reverseMap = Object.fromEntries(
      Object.entries(SENSOR_NAME_MAP[originalDeviceName] || {}).map(
        ([orig, renamed]) => [renamed, orig]
      )
    );
    const originalSensorName = reverseMap[sensor.name] || sensor.name;

    const threshold = thresholds[originalSensorName];
    return (
      threshold !== undefined &&
      sensor.value !== undefined &&
      sensor.value < threshold
    );
  });

  // ✅ Переносим side effect в useEffect
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sound = (window as any).__PRELOADED_ALERT_SOUND__;
    if (sound && shouldBlink) {
      sound.currentTime = 0;
      sound.play().catch((err) => {
        console.log('Ошибка воспроизведения звука:', err);
      });
    }
  }, [shouldBlink]); // ← запускаем при изменении shouldBlink

  return (
    <div
      className={`card card--${type} ${!device.online ? 'card--offline' : ''}`}
      style={{
        animation: shouldBlink ? 'blink 1.8s infinite' : 'none',
      }}
    >
      <div className="card__header">
        <h3>{title}</h3>
        <span className="status-icon" title={status.label}>
          {status.icon}
        </span>
      </div>

      <div className="card__sensors">
        {sensors.length > 0 ? (
          sensors.map((sensor, index) => {
            const originalName = sensor.name.trim();
            const range = ranges[originalName] || {};

            const isOutOfRange =
              sensor.value !== undefined &&
              range.min !== undefined &&
              range.max !== undefined &&
              (sensor.value < range.min || sensor.value > range.max);

            const hasTriggered = sensor.triggered === true;
            const color = hasTriggered || isOutOfRange ? 'red' : '#333';

            return (
              <div key={index} className="sensor" style={{ color }}>
                <div>
                  <div className="sensor__value">
                    {sensor.value ?? '—'} {sensor.unit ?? ''}
                  </div>
                  <div className="sensor__label">{sensor.name}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="sensor sensor--empty">—</div>
        )}
      </div>

      {!device.online && (
        <div className="card__offline-badge">Оффлайн (посл. данные)</div>
      )}
    </div>
  );
};

export default Card;
