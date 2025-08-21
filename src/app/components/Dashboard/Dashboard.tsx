import React, { useState } from 'react';
import './Dashboard.scss';
import Card from '../Card/Card';

interface ZontDevice {
  id: number;
  name: string;
  online: boolean;
  sensors: Array<{
    id: number;
    name: string;
    type: string;
    value?: number;
    unit?: string;
    triggered?: boolean;
  }>;
}

interface DashboardProps {
  devices: ZontDevice[];
}

// Переименование объектов
const DEVICE_NAME_MAP: Record<string, string> = {
  'К.7/1 Teplo': 'Жилой комплекс «Медовая долина» 7к1',
  'К. 5/1 Teplo': 'Жилой комплекс «Медовая долина» 5к1',
  'Mar5. Teplo': 'Жилой комплекс «Марьино Град»',
  'Rum Teplo': 'Жилой комплекс Homecity',
  'Prokshino Teplo': 'Жилой комплекс «Николин Парк»',
  'Mar 5. VZU': 'Жилой комплекс «Марьино Град»',
  'Klen allei VZU': 'Жилой комплекс «Кленовые Аллеи»',
  'Rom VZU ': 'Жилой комплекс «Западное Кунцево»',
  'Krekshino VZU ': 'Жилой комплекс «Медовая долина»',
  'Cvet VZU ': 'Жилой комплекс «Цветочные Поляны»',
};

// Переименование датчиков
const SENSOR_NAME_MAP: Record<string, Record<string, string>> = {
  'К.7/1 Teplo': {
    'Темп. Отопление': 'Температура отопления',
    'Тем. ГВС': 'Температура горячего водоснабжения',
  },
  'К. 5/1 Teplo': {
    'Темп. Отопление': 'Температура отопления',
    'Тем. ГВС': 'Температура горячего водоснабжения',
  },
  'Mar5. Teplo': {
    'Темп. Отопление': 'Температура отопления',
    'Тем. ГВС': 'Температура горячего водоснабжения',
  },
  'Rum Teplo': {
    'Т подачи ':
      'Температура отопления (теплоносителя для приготовления горячего водоснабжения)',
  },
  'Prokshino Teplo': {
    'Т отопления ': 'Температура отопления',
    'Т ГВС ': 'Температура горячего водоснабжения',
  },
  'Mar 5. VZU': {
    'Давление город': 'Давления холодного водоснабжения',
  },
  'Klen allei VZU': {
    'Давление в город': 'Давления холодного водоснабжения',
  },
  'Rom VZU ': {
    'Д поселок ': 'Давления холодного водоснабжения',
  },
  'Krekshino VZU ': {
    'Давление в поселок': 'Давления холодного водоснабжения',
  },
  'Cvet VZU ': {
    'Д в поселок ': 'Давления холодного водоснабжения',
  },
};

const Dashboard: React.FC<DashboardProps> = ({ devices }) => {
  const [cachedDevices] = useState<ZontDevice[]>(devices);

  const getDevice = (name: string) => {
    return (
      devices.find((d) => d.name === name) ||
      cachedDevices.find((d) => d.name === name)
    );
  };

  const getDisplayDeviceName = (originalName: string) => {
    return DEVICE_NAME_MAP[originalName] || originalName;
  };

  const getDisplaySensorName = (deviceName: string, sensorName: string) => {
    const map = SENSOR_NAME_MAP[deviceName];
    return map?.[sensorName.trim()] || sensorName.trim();
  };

  const prepareSensors = (device: ZontDevice | undefined, name: string) => {
    if (!device) return [];

    // Для К.7/1 Teplo и К. 5/1 Teplo — только два показателя: Темп. Отопление и Темп. ГВС
    if (name === 'К.7/1 Teplo' || name === 'К. 5/1 Teplo') {
      const tempOt = device.sensors.find(
        (s) => s.name.trim() === 'Темп. Отопление'
      );
      const tempGvs = device.sensors.find((s) => s.name.trim() === 'Тем. ГВС');

      return [
        tempOt
          ? {
              name: getDisplaySensorName(name, 'Темп. Отопление'),
              value: tempOt.value,
              unit: tempOt.unit,
              triggered: tempOt.triggered,
            }
          : null,
        tempGvs
          ? {
              name: getDisplaySensorName(name, 'Тем. ГВС'),
              value: tempGvs.value,
              unit: tempGvs.unit,
              triggered: tempGvs.triggered,
            }
          : null,
      ].filter(Boolean);
    }

    // Для Rum Teplo — только Т подачи
    if (name === 'Rum Teplo') {
      const sensor = device.sensors.find((s) => s.name.trim() === 'Т подачи ');
      if (sensor) {
        return [
          {
            name: getDisplaySensorName(name, 'Т подачи '),
            value: sensor.value,
            unit: sensor.unit,
            triggered: sensor.triggered,
          },
        ];
      }
      return [];
    }

    // Для всех остальных — фильтруем температуру и давление
    return device.sensors
      .filter((s) => s.type === 'temperature' || s.type === 'pressure')
      .map((sensor) => ({
        name: getDisplaySensorName(name, sensor.name),
        value: sensor.value,
        unit: sensor.unit,
        triggered: sensor.triggered,
      }));
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">ГРК — Мониторинг ГВС и отопления</h1>

      <div className="dashboard__grid">
        {/* Блок 1: К.7/1 Teplo, К.5/1 Teplo, Krekshino VZU */}
        <div className="block block--primary">
          <Card
            title={getDisplayDeviceName('К.7/1 Teplo')}
            online={!!getDevice('К.7/1 Teplo')?.online}
            sensors={prepareSensors(getDevice('К.7/1 Teplo'), 'К.7/1 Teplo')}
          />
          <Card
            title={getDisplayDeviceName('К. 5/1 Teplo')}
            online={!!getDevice('К. 5/1 Teplo')?.online}
            sensors={prepareSensors(getDevice('К. 5/1 Teplo'), 'К. 5/1 Teplo')}
          />
          <Card
            title={getDisplayDeviceName('Krekshino VZU ')}
            online={!!getDevice('Krekshino VZU ')?.online}
            sensors={prepareSensors(
              getDevice('Krekshino VZU '),
              'Krekshino VZU '
            )}
          />
        </div>

        {/* Блок 2: Mar5. Teplo, Mar 5. VZU */}
        <div className="block block--secondary">
          <Card
            title={getDisplayDeviceName('Mar5. Teplo')}
            online={!!getDevice('Mar5. Teplo')?.online}
            sensors={prepareSensors(getDevice('Mar5. Teplo'), 'Mar5. Teplo')}
          />
          <Card
            title={getDisplayDeviceName('Mar 5. VZU')}
            online={!!getDevice('Mar 5. VZU')?.online}
            sensors={prepareSensors(getDevice('Mar 5. VZU'), 'Mar 5. VZU')}
          />
        </div>

        {/* Остальные */}
        <Card
          title={getDisplayDeviceName('Prokshino Teplo')}
          online={!!getDevice('Prokshino Teplo')?.online}
          sensors={prepareSensors(
            getDevice('Prokshino Teplo'),
            'Prokshino Teplo'
          )}
        />
        <Card
          title={getDisplayDeviceName('Rum Teplo')}
          online={!!getDevice('Rum Teplo')?.online}
          sensors={prepareSensors(getDevice('Rum Teplo'), 'Rum Teplo')}
        />
        <Card
          title={getDisplayDeviceName('Rom VZU ')}
          online={!!getDevice('Rom VZU ')?.online}
          sensors={prepareSensors(getDevice('Rom VZU '), 'Rom VZU ')}
        />
        <Card
          title={getDisplayDeviceName('Cvet VZU ')}
          online={!!getDevice('Cvet VZU ')?.online}
          sensors={prepareSensors(getDevice('Cvet VZU '), 'Cvet VZU ')}
        />
        <Card
          title={getDisplayDeviceName('Klen allei VZU')}
          online={!!getDevice('Klen allei VZU')?.online}
          sensors={prepareSensors(
            getDevice('Klen allei VZU'),
            'Klen allei VZU'
          )}
        />
      </div>
    </div>
  );
};

export default Dashboard;
