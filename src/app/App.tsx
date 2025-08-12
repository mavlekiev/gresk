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
        
        const response = await fetch(
          'https://server-gresk.onrender.com/api/zont/devices'
        );

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

  return (
    <div className="app">
      <Dashboard devices={devices} />
      <iframe src="https://my.zont.online/api/graphs-frame?_public_api_key=6e14d9e93dcde2b5716f5323e5d604a0aafbedd6" allow="fullscreen" width="100%" height="100%" style={{ border: 'none' }}></iframe>
    </div>
  );
};

export default App;
