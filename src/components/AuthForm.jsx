import { useState } from 'preact/hooks';
import { nhost } from '../nhost';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await nhost.auth.signIn({ email, password });
      } else {
        await nhost.auth.signUp({ email, password });
      }
    } catch (err) {
      setError(err.message || 'Auth error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '100px auto' }}>
      <h2>{mode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
      <input type="email" placeholder="Email" value={email} required onInput={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} required onInput={e => setPassword(e.target.value)} />
      <button type="submit">{mode === 'login' ? 'Sign In' : 'Sign Up'}</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Create Account' : 'Already have account?'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}