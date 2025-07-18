import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.scss';
import type { ZontDevice } from './utils/interfaces/zont-devices.interface';

const App: React.FC = () => {
  const [devices, setDevices] = useState<ZontDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // const url = 'https://my.zont.online/api/widget/v3/devices';
        // const zontClientName = 'mavlekiev@gmail.com';
        // const zontToken = '917anr4jyo1v8l59uweaaxs8agr7s4av';
        const response = await fetch('http://localhost:3000/api/zont/devices');

        if (!response.ok) throw new Error('Ошибка загрузки данных');

        const data = await response.json();
        setDevices(data.devices);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError('Произошла неизвестная ошибка');
        }
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="card-list__message">Загрузка данных...</p>;
  if (error) return <p className="card-list__message">Ошибка: {error}</p>;

  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <Dashboard devices={devices} />
    </div>
  );
};

export default App;
