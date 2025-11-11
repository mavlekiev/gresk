import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './Dashboard.scss';
import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';
import HeatingSeasonForm from '../HeatingSeasonForm    /HeatingSeasonForm';
import { DEVICE_NAME_MAP, SENSOR_NAME_MAP } from '../../utils/const/const';

interface DashboardProps {
  devices: ZontDevice[];
}

const Dashboard: React.FC<DashboardProps> = ({ devices }) => {
  const [cachedDevices, setCachedDevices] = useState<ZontDevice[]>(devices);
  const [heatingSeason, setHeatingSeason] = useState<{
    start: string;
    end: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('heatingSeason');
    if (saved) {
      setHeatingSeason(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      setCachedDevices((prev) => {
        const newCache = [...prev];
        devices.forEach((device) => {
          const index = newCache.findIndex((d) => d.id === device.id);
          if (index !== -1) {
            newCache[index] = device;
          } else {
            newCache.push(device);
          }
        });
        return newCache;
      });
    }
  }, [devices]);

  const findSensorsByTypeAndKeywords = (
    device: ZontDevice,
    type: string,
    keywords: string[] = []
  ) => {
    const normalized = (str: string) => str.trim().toLowerCase();
    return device.sensors
      .filter((s) => {
        if (s.type !== type) return false;
        if (keywords.length === 0) return true;
        const sensorName = normalized(s.name);
        return keywords.some((kw) => sensorName.includes(normalized(kw)));
      })
      .map((s) => ({
        name: s.name,
        value: s.value,
        unit: s.unit,
        triggered: s.triggered,
      }));
  };

  const getDisplayDevice = (deviceName: string): ZontDevice | undefined => {
    const current = devices.find((d) => d.name.trim() === deviceName);
    if (current && current.online) return current;

    const cached = cachedDevices.find((d) => d.name.trim() === deviceName);
    return cached;
  };

  const getRangesForDevice = (device: ZontDevice) => {
    const ranges: Record<string, { min?: number; max?: number }> = {};

    const consumerCircuit = device.circuits.find((c) => c.type === 'consumer');
    if (consumerCircuit) {
      device.sensors
        .filter((s) => s.type === 'temperature')
        .forEach((sensor) => {
          ranges[sensor.name.trim()] = {
            min: consumerCircuit.min,
            max: consumerCircuit.max,
          };
        });
    }

    device.circuits.forEach((circuit) => {
      if (circuit.name.toLowerCase().includes('город')) {
        device.sensors
          .filter(
            (s) =>
              s.type === 'pressure' && s.name.toLowerCase().includes('город')
          )
          .forEach((s) => {
            ranges[s.name.trim()] = { min: circuit.min, max: circuit.max };
          });
      }
      if (
        circuit.name.toLowerCase().includes('поселок') ||
        circuit.name.toLowerCase().includes('в поселок')
      ) {
        device.sensors
          .filter(
            (s) =>
              s.type === 'pressure' &&
              (s.name.toLowerCase().includes('поселок') ||
                s.name.toLowerCase().includes('в поселок'))
          )
          .forEach((s) => {
            ranges[s.name.trim()] = { min: circuit.min, max: circuit.max };
          });
      }
    });

    return ranges;
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Мониторинг показателей</h1>

      <div className="dashboard__grid">
        {/* Блок 1: К.7/1 Teplo, К. 5/1 Teplo, Krekshino VZU */}
        <div className="block block--primary">
          {['К.7/1 Teplo', 'К. 5/1 Teplo'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensors = findSensorsByTypeAndKeywords(device, 'temperature');
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="teplo"
                sensors={sensors.map((sensor) => ({
                  ...sensor,
                  name:
                    SENSOR_NAME_MAP[name]?.[sensor.name.trim()] || sensor.name,
                }))}
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
          {['Krekshino VZU'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensor = findSensorsByTypeAndKeywords(device, 'pressure', [
              'в поселок',
              'давление в поселок',
            ])[0];
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="vzu"
                sensors={
                  sensor
                    ? [
                        {
                          ...sensor,
                          name:
                            SENSOR_NAME_MAP[name]?.[sensor.name.trim()] ||
                            sensor.name,
                        },
                      ]
                    : []
                }
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
        </div>

        {/* Блок 2: Mar5. Teplo, Mar 5. VZU */}
        <div className="block block--secondary">
          {['Mar5. Teplo'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensors = findSensorsByTypeAndKeywords(device, 'temperature');
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="teplo"
                sensors={sensors.map((sensor) => ({
                  ...sensor,
                  name:
                    SENSOR_NAME_MAP[name]?.[sensor.name.trim()] || sensor.name,
                }))}
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
          {['Mar 5. VZU'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensor = findSensorsByTypeAndKeywords(device, 'pressure', [
              'город',
              'давление город',
            ])[0];
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="vzu"
                sensors={
                  sensor
                    ? [
                        {
                          ...sensor,
                          name:
                            SENSOR_NAME_MAP[name]?.[sensor.name.trim()] ||
                            sensor.name,
                        },
                      ]
                    : []
                }
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
        </div>

        {/* Остальные */}
        {['Rum Teplo', 'Prokshino Teplo'].map((name) => {
          const device = getDisplayDevice(name);
          if (!device) return null;

          let sensors = findSensorsByTypeAndKeywords(device, 'temperature');
          if (name === 'Rum Teplo') {
            sensors = sensors.filter((s) => s.name.includes('Т подачи'));
          }

          if (name === 'Prokshino Teplo') {
            sensors = sensors.reverse();
          }

          const ranges = getRangesForDevice(device);

          return (
            <div className="wrapper" key={name}>
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="teplo"
                sensors={sensors.map((sensor) => ({
                  ...sensor,
                  name:
                    SENSOR_NAME_MAP[name]?.[sensor.name.trim()] || sensor.name,
                }))}
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            </div>
          );
        })}

        <div className="wrapper">
          {['Klen allei VZU'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensor = findSensorsByTypeAndKeywords(device, 'pressure', [
              'город',
              'давление город',
            ])[0];
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="vzu"
                sensors={
                  sensor
                    ? [
                        {
                          ...sensor,
                          name:
                            SENSOR_NAME_MAP[name]?.[sensor.name.trim()] ||
                            sensor.name,
                        },
                      ]
                    : []
                }
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
        </div>

        <div className="wrapper">
          {['Rom VZU'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensor = findSensorsByTypeAndKeywords(device, 'pressure', [
              'поселок',
              'давление поселок',
            ])[0];
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="vzu"
                sensors={
                  sensor
                    ? [
                        {
                          ...sensor,
                          name:
                            SENSOR_NAME_MAP[name]?.[sensor.name.trim()] ||
                            sensor.name,
                        },
                      ]
                    : []
                }
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
        </div>

        <div className="wrapper">
          {['Cvet VZU'].map((name) => {
            const device = getDisplayDevice(name);
            if (!device) return null;

            const sensor = findSensorsByTypeAndKeywords(device, 'pressure', [
              'в поселок',
              'д в поселок',
            ])[0];
            const ranges = getRangesForDevice(device);

            return (
              <Card
                key={name}
                device={device}
                title={DEVICE_NAME_MAP[name]}
                type="vzu"
                sensors={
                  sensor
                    ? [
                        {
                          ...sensor,
                          name:
                            SENSOR_NAME_MAP[name]?.[sensor.name.trim()] ||
                            sensor.name,
                        },
                      ]
                    : []
                }
                ranges={ranges}
                heatingSeason={heatingSeason}
              />
            );
          })}
        </div>
      </div>
      <HeatingSeasonForm onSeasonChange={() => {}} />
    </div>
  );
};

export default Dashboard;
