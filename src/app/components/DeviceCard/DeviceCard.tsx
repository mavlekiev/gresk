import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';

export const ZontDeviceCard = ({ device }: { device: ZontDevice }) => {
  const heatingSensor = device.sensors.find(
    (s) =>
      s.name.toLocaleLowerCase().includes('отоплеие') &&
      s.type === 'temperature'
  );
  const hotWaterSensor = device.sensors.find(
    (s) =>
      s.name.toLocaleLowerCase().includes('гвс') && s.type === 'temperature'
  );

  return (
    <div
      className="card"
      style={{
        backgroundColor: device.online ? '#fff' : '#f9f9f9',
      }}
    >
      <h3 className="card__title">{device.name}</h3>
      {device.online ? (
        <>
          {heatingSensor && (
            <p>
              🔥 Отопление:{' '}
              <strong>
                {heatingSensor.value} {heatingSensor.unit}C
              </strong>
            </p>
          )}
          {hotWaterSensor && (
            <p>
              💧 ГВС:{' '}
              <strong>
                {hotWaterSensor.value} {hotWaterSensor.unit}C
              </strong>
            </p>
          )}
        </>
      ) : (
        <p>⚠️ Устройство оффлайн</p>
      )}
    </div>
  );
};
