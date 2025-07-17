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

  const getTemperatureSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'temperature');
  };

  const getPressureSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'pressure');
  };

  const getVoltageSensors = (device: ZontDevice) => {
    return device.sensors.filter((sensor) => sensor.type === 'voltage');
  };

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

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
                {getTemperatureSensors(selectedDevice).map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} />
                ))}
              </div>
            ) : (
              <p>Датчиков температуры не найдено</p>
            )}

            <h2>ДАТЧИКИ</h2>
            {getVoltageSensors(selectedDevice).length > 0 ? (
              <div className="sensor-grid">
                {getVoltageSensors(selectedDevice).map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} />
                ))}
              </div>
            ) : (
              <p>Датчиков напряжения не найдено</p>
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
// import { useEffect, useState } from 'react';
// import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
// import { ZontDeviceCard } from '../DeviceCard/DeviceCard';

// export const ZontDeviceList = () => {
//   const [devices, setDevices] = useState<ZontDevice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // const url = 'https://my.zont.online/api/widget/v3/devices';
//         // const zontClientName = 'mavlekiev@gmail.com';
//         // const zontToken = '917anr4jyo1v8l59uweaaxs8agr7s4av';
//         const response = await fetch('http://localhost:3000/api/zont/devices');

//         if (!response.ok) throw new Error('Ошибка загрузки данных');

//         const data = await response.json();
//         setDevices(data.devices);
//         setLoading(false);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else if (typeof err === 'string') {
//           setError(err);
//         } else {
//           setError('Произошла неизвестная ошибка');
//         }
//         setLoading(false);
//       }
//     }

//     // const fetchZontData = async () => {
//     //   try {
//     //     const data = await getZontDevices();

//     //     if (data.ok && Array.isArray(data.devices)) {
//     //       setDevices(data.devices);
//     //     } else {
//     //       throw new Error('Неверный формат ответа');
//     //     }
//     //   } catch (error: any) {
//     //     setError(error.message || 'Неизвестная ошибка');
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // };
//     fetchData();
//     const interval = setInterval(fetchData, 300000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <p className="card-list__message">Загрузка данных...</p>;
//   if (error) return <p className="card-list__message">Ошибка: {error}</p>;

//   return (
//     <div className="card-list">
//       {devices.length > 0 ? (
//         devices.map((device) => (
//           <ZontDeviceCard key={device.id} device={device} />
//         ))
//       ) : (
//         <p>Нет данных</p>
//       )}
//     </div>
//   );
// };
