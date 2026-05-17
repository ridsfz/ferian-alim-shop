import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, formatRupiah }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);


  const getFallbackImage = () => {
    if (imageError) {
      return `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(product.name.substring(0,10))}`;
    }
    return product.image;
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={getFallbackImage()}
          alt={product.name}
          loading="lazy"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          style={{ 
            opacity: imageLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease'
          }}
        />
        <span className="product-badge">{product.category}</span>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="price">
          <span className="current-price">
            {formatRupiah(product.price)}
          </span>
          <span className="old-price">
            {formatRupiah(Math.round(product.price * 1.3))}
          </span>
        </div>
        <button className="add-to-cart">🛒 Beli Sekarang</button>
      </div>
    </div>
  );
};

export default ProductCard;