import { useState, useEffect } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import LoginRegister from "./components/LoginRegister";
import './App.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            // Token expired/invalid, force logout
            handleLogout();
          }
        })
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleRegister = async (name, email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.error) { alert('❌ ' + data.error); return; }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      alert(`🎉 Akun ${name} berhasil dibuat & login otomatis!`);
    } catch (e) {
      alert('❌ Gagal register, coba lagi.');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.error) { alert('❌ Email atau password salah!'); return; }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setShowLogin(false);
      alert(`✅ Selamat datang ${data.user.name}!`);
    } catch (e) {
      alert('❌ Gagal login, coba lagi.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    alert('Sampai jumpa!');
  };

  const formatRupiah = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Ferian_Alim-Shop Premium...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header
        user={user}
        token={token}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {token && user ? (
          <>
            <section className="hero">
              <div className="hero-content">
                <h1 className="hero-title">Ferian_Alim-SHOP PREMIUM</h1>
                <p className="hero-subtitle">Selamat datang <strong>{user.name}</strong>! • Eksklusif untuk Member</p>
                <div className="hero-stats">
                  <div className="stat"><span>8+</span><small>Produk</small></div>
                  <div className="stat"><span>⭐</span><small>Luxury</small></div>
                  <div className="stat"><span>24/7</span><small>Support</small></div>
                </div>
              </div>
            </section>

            <section className="products-section">
              <h2 className="section-title">Produk Premium</h2>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    formatRupiah={formatRupiah}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          showLogin && (
            <LoginRegister onLogin={handleLogin} onRegister={handleRegister} />
          )
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;