import React from 'react';
import './DeviceList.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';

interface DeviceListProps {
  devices: ZontDevice[];
  onSelectDevice: (deviceId: number) => void;
  selectedDeviceId: number | null;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onSelectDevice,
  selectedDeviceId,
}) => {
  return (
    <div className="device-list">
      {devices.map((device) => (
        <div
          key={device.id}
          className={`device-item ${device.id === selectedDeviceId ? 'selected' : ''}`}
          onClick={() => onSelectDevice(device.id)}
        >
          <div className="device-status">
            <span className={device.online ? 'online' : 'offline'}></span>
            <div className="device-description">
              <h3>{device.name}</h3>
              <p>{device.device_info.model}</p>
              <p>{device.online ? 'На связи' : 'Не на связи'}</p>
            </div>
          </div>
          <div className="device-actions">
            {/* Здесь можно добавить дополнительные действия */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
