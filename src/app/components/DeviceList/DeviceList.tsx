import { useEffect, useState } from 'react';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import { ZontDeviceCard } from '../DeviceCard/DeviceCard';

export const ZontDeviceList = () => {
  const [devices, setDevices] = useState<ZontDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          'https://my.zont.online/api/widget/v3/devices ',
          {
            headers: {
              'X-ZONT-Client': 'mavlekiev@gmail.com',
              'X-ZONT-TOKEN': '917anr4jyo1v8l59uweaaxs8agr7s4av',
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

    // const fetchZontData = async () => {
    //   try {
    //     const data = await getZontDevices();

    //     if (data.ok && Array.isArray(data.devices)) {
    //       setDevices(data.devices);
    //     } else {
    //       throw new Error('Неверный формат ответа');
    //     }
    //   } catch (error: any) {
    //     setError(error.message || 'Неизвестная ошибка');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="card-list__message">Загрузка данных...</p>;
  if (error) return <p className="card-list__message">Ошибка: {error}</p>;

  return (
    <div className="card-list">
      {devices.length > 0 ? (
        devices.map((device) => (
          <ZontDeviceCard key={device.id} device={device} />
        ))
      ) : (
        <p>Нет данных</p>
      )}
    </div>
  );
};
