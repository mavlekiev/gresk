import React, { useState } from 'react';
import './AuthModal.scss';

interface AuthModalProps {
  onLogin: (password: string) => boolean;
}

export default function AuthModal(props: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (props.onLogin(password)) {
      return;
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="auth-modal">
      <div className="auth-modal__content">
        <div className="auth-modal__header">
          <h2 className="auth-modal__title">🔒 Доступ к диспетчерской</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          <div className="auth-modal__input-group">
            <div className="auth-modal__password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="auth-modal__input"
                autoFocus
              />
              <button
                type="button"
                className="auth-modal__toggle-visibility"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {error && <p className="auth-modal__error">{error}</p>}
          </div>

          <button type="submit" className="auth-modal__submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
