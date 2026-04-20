import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-[var(--surface-high)]  p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-border">
      <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
      {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field" 
            placeholder="you@example.com" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field" 
            placeholder="••••••••" 
            required
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-300 dark:border-dark-border" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-primary-600 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full py-3 mt-4">Log In</button>
      </form>
      <p className="mt-6 text-center text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
        Don't have an account? <Link to="/signup" className="text-primary-600 hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
