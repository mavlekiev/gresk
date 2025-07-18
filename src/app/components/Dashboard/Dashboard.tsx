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
    return device.sensors.filter((sensor) =>
      sensor.name.includes('Контроль напряжения питания')
    );
  };

  // Получаем диапазон по `name` контура
  const getRangeForSensor = (device: ZontDevice, sensorName: string) => {
    let circuitName = '';

    if (sensorName.includes('отопление')) {
      circuitName = 'Отопление';
    } else if (sensorName.includes('ГВС')) {
      circuitName = 'Тем. ГВС';
    } else if (sensorName.includes('давление')) {
      circuitName = 'Давление';
    } else if (sensorName.includes('напряжения')) {
      circuitName = 'Контроль напряжения питания';
    }

    const circuit = device.circuits.find((c) => c.name === circuitName);

    return {
      min: circuit?.min ?? undefined,
      max: circuit?.max ?? undefined,
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
                    sensor.name
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
                    sensor.name
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
                    sensor.name
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
