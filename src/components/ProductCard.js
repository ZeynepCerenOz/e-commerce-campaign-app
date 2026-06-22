'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleAddToCartClick = async (e) => {
    e.preventDefault(); // Prevent Link navigation

    try {
      const res = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, quantity: 1 }), // Default quantity = 1
      });

      if (!res.ok) {
        throw new Error('Failed to add to cart');
      }

      alert(`Added 1 x "${product.name}" to cart`);
    } catch (err) {
      console.error(err);
      alert('Something went wrong while adding to cart.');
    }
  };

  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <Link href={`/product/${product.id}`} className="text-decoration-none text-dark">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          className="card-img-top"
          alt={product.name}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text fw-bold">${product.price}</p>
        <button className="btn btn-primary" onClick={handleAddToCartClick}>
          Add to Cart
        </button>
        <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
          Quantity can be changed in the product page or cart.
        </p>
      </div>
    </div>
  );
}
