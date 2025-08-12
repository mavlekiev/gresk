import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import './App.scss';
import type { ZontDevice } from './utils/interfaces/zont-devices.interface';

const App: React.FC = () => {
  const [devices, setDevices] = useState<ZontDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ZONT_TOKEN = process.env.ZONT_TOKEN;
  const ZONT_CLIENT = process.env.ZONT_CLIENT;

  useEffect(() => {
    async function fetchData() {
      if (!ZONT_CLIENT || !ZONT_TOKEN) {
        setError('Не заданы переменные окружения ZONT_CLIENT или ZONT_TOKEN');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          'https://my.zont.online/api/widget/v3/devices ',
          {
            method: 'GET',
            headers: {
              'X-ZONT-Client': ZONT_CLIENT,
              'X-ZONT-TOKEN': ZONT_TOKEN,
            },
          }
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
  }, [ZONT_CLIENT, ZONT_TOKEN]);

  if (loading) return <p className="card-list__message">Загрузка данных...</p>;
  if (error) return <p className="card-list__message">Ошибка: {error}</p>;

  return (
    <div className="app">
      <Dashboard devices={devices} />
    </div>
  );
};

export default App;
