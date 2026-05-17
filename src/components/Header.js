const Header = ({ user, token, onLogin, onLogout }) => (
  <header className="header">
    <div className="container">
      <h1 className="logo">Ferian_Alim-SHOP</h1>
      <div className="header-actions">
        {token ? (
          <>
            <span className="user-info"> {user?.name}</span>
            <button className="btn-logout" onClick={onLogout}> Keluar</button>
          </>
        ) : (
          <button className="btn-login" onClick={onLogin}> Masuk</button>
        )}
      </div>
    </div>
  </header>
);

export default Header;