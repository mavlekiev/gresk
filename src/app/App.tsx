import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import AuthModal from './components/AuthModal/AuthModal';
import './App.scss';
import type { ZontDevice } from './utils/interfaces/zont-devices.interface';

const App: React.FC = () => {
  const [devices, setDevices] = useState<ZontDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    let context: AudioContext | null = null;
    const sound = new Audio('/sounds/alarm.mp3');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__PRELOADED_ALERT_SOUND__ = sound;

    const unlock = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!context) {
        context = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
      }

      const unlockNode = context.createGain();
      unlockNode.connect(context.destination);
      unlockNode.gain.setValueAtTime(0, context.currentTime);
      unlockNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.01);

      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
    };

    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
  };

  useEffect(() => {
    preloadAndUnlockOnInteraction();
  }, []);

  const handleLogin = (password: string) => {
    if (password === import.meta.env.VITE_APP_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

  if (!isAuthenticated) {
    return <AuthModal onLogin={handleLogin} />;
  }

  if (loading) return <p className="card-list__message">Загрузка данных...</p>;
  if (error) return <p className="card-list__message">Ошибка: {error}</p>;

  return (
    <div className="app">
      <Dashboard devices={devices} />
    </div>
  );
};

export default App;
