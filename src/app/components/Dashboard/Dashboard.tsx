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
  const getTemperatureSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'temperature');
  };

  const getPressureSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'pressure');
  };

  const getVoltageSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'voltage');
  };

  // Получаем диапазон по типу датчика
  const getRangeForSensor = (device: ZontDevice, sensorType: string) => {
    let circuitType = '';

    switch (sensorType) {
      case 'temperature':
        circuitType = 'consumer'; // или 'boiler', в зависимости от логики
        break;
      case 'pressure':
        circuitType = 'consumer'; // или отдельный контур для давления
        break;
      case 'voltage':
        circuitType = 'boiler'; // или любой другой контур
        break;
      default:
        circuitType = 'consumer';
    }

    const circuit = device.circuits.find((c) => c.type === circuitType);

    return {
      min: circuit?.min,
      max: circuit?.max,
    };
  };

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
            <h2>ТЕМПЕРАТУРА</h2>
            {getTemperatureSensors(selectedDevice).length > 0 ? (
              <div className="sensor-grid">
                {getTemperatureSensors(selectedDevice).map((sensor) => {
                  const { min, max } = getRangeForSensor(
                    selectedDevice,
                    'temperature'
                  );
                  return (
                    <SensorCard
                      key={sensor.id}
                      sensor={sensor}
                      min={min}
                      max={max}
                    />
                  );
                })}
              </div>
            ) : (
              <p>Датчиков температуры не найдено</p>
            )}

            <h2>ДАТЧИКИ</h2>

            {getVoltageSensors(selectedDevice).length > 0 ? (
              <div className="sensor-grid">
                {getVoltageSensors(selectedDevice).map((sensor) => {
                  const { min, max } = getRangeForSensor(
                    selectedDevice,
                    'voltage'
                  );
                  return (
                    <SensorCard
                      key={sensor.id}
                      sensor={sensor}
                      min={min}
                      max={max}
                    />
                  );
                })}
              </div>
            ) : (
              <p>Датчиков напряжения не найдено</p>
            )}

            {getPressureSensors(selectedDevice).length > 0 ? (
              <div className="sensor-grid">
                {getPressureSensors(selectedDevice).map((sensor) => {
                  const { min, max } = getRangeForSensor(
                    selectedDevice,
                    'pressure'
                  );
                  return (
                    <SensorCard
                      key={sensor.id}
                      sensor={sensor}
                      min={min}
                      max={max}
                    />
                  );
                })}
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
