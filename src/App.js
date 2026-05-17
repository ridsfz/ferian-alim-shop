import { useState, useEffect } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import LoginRegister from "./components/LoginRegister";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const mockProducts = [
 
  { 
    _id: 1, 
    name: "iPhone 15 Pro Max 1TB", 
    price: 24999000, 
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", 
    category: "Electronics" 
  },
  

  { 
    _id: 2, 
    name: "MacBook Pro M3 Max", 
    price: 45999000, 
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", 
    category: "Electronics" 
  },
  
  { 
    _id: 3, 
    name: "Rolex Submariner", 
    price: 145000000, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", 
    category: "Luxury" 
  },
  
  { 
    _id: 4, 
    name: "Nike Air Jordan 1 Retro", 
    price: 2799000, 
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop", 
    category: "Fashion" 
  },
  
  { 
    _id: 5, 
    name: "PS5 Slim Digital", 
    price: 8499000, 
    image: "https://images.unsplash.com/photo-1606144042614-7d8f4f0e9a4d?w=400&h=300&fit=crop", 
    category: "Gaming" 
  },
  
  { 
    _id: 6, 
    name: "Louis Vuitton Neverfull", 
    price: 38500000, 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", 
    category: "Fashion" 
  },
  
  { 
    _id: 7, 
    name: "DXRacer Gaming Chair", 
    price: 7499000, 
    image: "https://images.unsplash.com/photo-1558618048-7f75e22a8f8d?w=400&h=300&fit=crop", 
    category: "Gaming" 
  },
  
  { 
    _id: 8, 
    name: "AirPods Pro 2", 
    price: 3499000, 
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", 
    category: "Electronics" 
  },
];

  const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');

  useEffect(() => {
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  //  MOCK REGISTER - Simpan ke localStorage
  const handleRegister = (name, email, password) => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      alert('❌ Email sudah terdaftar!');
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

    // Auto login
    const mockToken = 'mock-jwt-' + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setToken(mockToken);
    setUser(newUser);
    setShowLogin(false);
    alert(` Akun ${name} berhasil dibuat & login otomatis! 🎉`);
  };

  const handleLogin = (email, password) => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      alert('❌ Email atau password salah!');
      return;
    }

    const mockToken = 'mock-jwt-' + Date.now();
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(foundUser));
    
    setToken(mockToken);
    setUser(foundUser);
    setShowLogin(false);
    alert(`✅ Selamat datang ${foundUser.name}! `);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    alert(' Sampai jumpa!');
  };

  //  FORMAT RUPIAH
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
        <p> Loading Ferian_Alim-Shop Premium...</p>
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
                <h1 className="hero-title"> Ferian_Alim-SHOP PREMIUM</h1>
                <p className="hero-subtitle">Selamat datang <strong>{user.name}</strong>! • Eksklusif untuk Member</p>
                <div className="hero-stats">
                  <div className="stat">
                    <span>8+</span>
                    <small>Produk</small>
                  </div>
                  <div className="stat">
                    <span></span>
                    <small>Luxury</small>
                  </div>
                  <div className="stat">
                    <span>24/7</span>
                    <small>Support</small>
                  </div>
                </div>
              </div>
            </section>

            <section className="products-section">
              <h2 className="section-title"> Produk Premium</h2>
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