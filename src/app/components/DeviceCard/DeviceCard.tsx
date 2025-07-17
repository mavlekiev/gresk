import type { ZontDevice } from '../../utils/interfaces/zont-devices.interface';

export const ZontDeviceCard = ({ device }: { device: ZontDevice }) => {
  // Температура
  const heatingTempSensor = device.sensors.find(
    (s) =>
      s.name.toLowerCase().includes('отопление') && s.type === 'temperature'
  );
  const hotWaterTempSensor = device.sensors.find(
    (s) => s.name.toLowerCase().includes('гвс') && s.type === 'temperature'
  );

  // Давление
  const heatingPressureSensor = device.sensors.find(
    (s) => s.name.toLowerCase().includes('отопление') && s.type === 'pressure'
  );
  const hotWaterPressureSensor = device.sensors.find(
    (s) => s.name.toLowerCase().includes('гвс') && s.type === 'pressure'
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
          {heatingTempSensor && (
            <p>
              Температура отопления:{' '}
              <strong>
                {heatingTempSensor.value} {heatingTempSensor.unit}C
              </strong>
            </p>
          )}

          {heatingPressureSensor && (
            <p>
              Давление отопления:{' '}
              <strong>
                {heatingPressureSensor.value} {heatingPressureSensor.unit}
              </strong>
            </p>
          )}

          {hotWaterTempSensor && (
            <p>
              Температура ГВС:{' '}
              <strong>
                {hotWaterTempSensor.value} {hotWaterTempSensor.unit}C
              </strong>
            </p>
          )}

          {hotWaterPressureSensor && (
            <p>
              Давление ГВС:{' '}
              <strong>
                {hotWaterPressureSensor.value} {hotWaterPressureSensor.unit}
              </strong>
            </p>
          )}

          {!heatingTempSensor &&
            !heatingPressureSensor &&
            !hotWaterTempSensor &&
            !hotWaterPressureSensor && <p>Нет данных для отображения</p>}
        </>
      ) : (
        <p>⚠️ Устройство оффлайн</p>
      )}
    </div>
  );
};
