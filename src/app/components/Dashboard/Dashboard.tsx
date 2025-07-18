import React, { useState } from 'react';
import DeviceList from '../DeviceList/DeviceList';
import SensorCard from '../SensorCard/SensorCard';
import './Dashboard.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';

interface DashboardProps {
  devices: ZontDevice[];
}

const Dashboard: React.FC<DashboardProps> = ({ devices }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const handleSelectDevice = (deviceId: number) => {
    setSelectedDeviceId(deviceId);
  };

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  // Фильтры датчиков
  const getTemperatureSensors = (device: ZontDevice) =>
    device.sensors.filter((sensor) => sensor.type === 'temperature');

  const getPressureSensors = (device: ZontDevice) =>
    device.sensors.filter((sensor) => sensor.type === 'pressure');

  const getVoltageSensors = (device: ZontDevice) =>
    device.sensors.filter(
      (sensor) =>
        sensor.name.includes('Контроль напряжения питания') ||
        sensor.name.includes('Напряжение питания')
    );

  return (
    <div className="dashboard">
      <div className="left-panel">
        <DeviceList
          devices={devices}
          onSelectDevice={handleSelectDevice}
          selectedDeviceId={selectedDeviceId}
        />
      </div>
      <div className="right-panel">
        {!selectedDevice ? (
          <p>Выберите устройство из списка слева</p>
        ) : (
          <>
            {getTemperatureSensors(selectedDevice).length > 0 ? (
              <>
                <h2 className="title">ТЕМПЕРАТУРА</h2>
                <div className="sensor-grid">
                  {getTemperatureSensors(selectedDevice).map((sensor) => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </>
            ) : (
              ''
            )}

            {getVoltageSensors(selectedDevice).length > 0 ? (
              <>
                <h2 className="title">ДАТЧИКИ</h2>
                <div className="sensor-grid">
                  {getVoltageSensors(selectedDevice).map((sensor) => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </>
            ) : (
              ''
            )}

            {getPressureSensors(selectedDevice).length > 0 ? (
              <div className="sensor-grid">
                {getPressureSensors(selectedDevice).map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} />
                ))}
              </div>
            ) : (
              <p>Датчиков давления не найдено</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
