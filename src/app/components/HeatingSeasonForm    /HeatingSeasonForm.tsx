import React, { useState, useEffect } from 'react';
import './HeatingSeasonForm.scss';

interface Props {
  onSeasonChange?: (start: string, end: string) => void;
}

const HeatingSeasonForm: React.FC<Props> = ({ onSeasonChange }) => {
  const savedSeason = localStorage.getItem('heatingSeason');
  const parsed = savedSeason ? JSON.parse(savedSeason) : null;

  const [start, setStart] = useState<string>(parsed?.start || '');
  const [end, setEnd] = useState<string>(parsed?.end || '');

  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    start: false,
    end: false,
  });

  useEffect(() => {
    if (!start || !end) {
      setError('Обе даты обязательны');
      return;
    }

    if (new Date(start) >= new Date(end)) {
      setError('Дата начала должна быть раньше даты окончания');
      return;
    }

    setError(null);
  }, [start, end]);

  useEffect(() => {
    if (start && end && !error) {
      onSeasonChange?.(start, end);
    }
  }, []);

  const handleBlur = (field: 'start' | 'end') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = () => {
    if (error) return;

    onSeasonChange?.(start, end);
    localStorage.setItem('heatingSeason', JSON.stringify({ start, end }));
  };

  const isFormValid = !error && start && end;

  return (
    <div
      style={{
        marginBottom: '20px',
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
        Отопительный сезон
      </h3>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'end',
          flexWrap: 'wrap',
        }}
      >
        {/* Поле "Начало" */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '14px', marginBottom: '4px' }}>
            Начало:
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            onBlur={() => handleBlur('start')}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border:
                touched.start && !start
                  ? '2px solid #e74c3c'
                  : '1px solid #ccc',
              minWidth: '140px',
            }}
          />
        </div>

        {/* Поле "Конец" */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '14px', marginBottom: '4px' }}>
            Конец:
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            onBlur={() => handleBlur('end')}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border:
                touched.end && !end ? '2px solid #e74c3c' : '1px solid #ccc',
              minWidth: '140px',
            }}
          />
        </div>

        {/* Кнопка "Сохранить" */}
        <button
          onClick={handleChange}
          disabled={!isFormValid}
          className="season-picker__button"
        >
          Сохранить
        </button>
      </div>

      {/* Сообщение об ошибке */}
      {error && touched.start && touched.end && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '14px',
            color: '#e74c3c',
            fontStyle: 'italic',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default HeatingSeasonForm;
