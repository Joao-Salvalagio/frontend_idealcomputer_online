import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import styles from './Login.module.css'; // Reusa o mesmo CSS do Login

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações frontend
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 Tentando registrar usuário:', { name, email });

      // 1. Registrar usuário
      const registerResponse = await api.post('/api/auth/register', {
        name,
        email,
        password
      });

      console.log('✅ Usuário registrado:', registerResponse.data);

      // 2. Fazer login automático após registro
      const loginResponse = await api.post('/api/auth/login', {
        email,
        password
      });

      console.log('✅ Login automático:', loginResponse.data);

      if (loginResponse.data && loginResponse.data.token) {
        login(loginResponse.data.token);
        console.log('✅ Redirecionando para home...');
        navigate('/');
      }
    } catch (err: any) {
      console.error('❌ Erro no registro:', err);
      console.error('❌ Resposta do erro:', err.response?.data);

      if (err.response?.status === 409 || err.response?.data?.includes('já existe')) {
        setError('Este email já está cadastrado');
      } else if (err.response?.status === 400) {
        setError(err.response?.data || 'Dados inválidos. Verifique os campos.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h2>Crie sua conta</h2>
          <p>Comece a montar seu PC ideal hoje</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              placeholder="João Silva"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.togglePassword}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className={styles.footer}>
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
