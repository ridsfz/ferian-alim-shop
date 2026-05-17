import React, { useState } from 'react';  

const LoginRegister = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (isLogin) {
      onLogin(data.email, data.password);
    } else {
      onRegister(data.name, data.email, data.password);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? ' Masuk' : ' Daftar'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input name="name" placeholder="Nama Lengkap *" required />
          )}
          <input name="email" type="email" placeholder="Email *" required />
          <input name="password" type="password" placeholder="Password *" required minLength="6" />
          <button type="submit" disabled={loading}>
            {loading ? ' Loading...' : (isLogin ? ' Masuk' : ' Daftar')}
          </button>
        </form>
        <p>
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Daftar sekarang' : ' Masuk sekarang'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;