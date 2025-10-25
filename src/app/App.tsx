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
          'https://zont-gresk.ru/api/zont-proxy.php'
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

  const preloadAndUnlockOnInteraction = () => {
    const audio = new Audio('/sounds/alarm.mp3');
    audio.preload = 'auto';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__PRELOADED_ALERT_SOUND__ = audio;

    const unlock = () => {
      audio.muted = false;
      audio.play();
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
  };

  useEffect(() => {
    preloadAndUnlockOnInteraction();
  }, []);

  if (loading) return <p className="card-list__message">Загрузка данных...</p>;
  if (error) return <p className="card-list__message">Ошибка: {error}</p>;

  return (
    <div className="app">
      <Dashboard devices={devices} />
    </div>
  );
};
export default App;
