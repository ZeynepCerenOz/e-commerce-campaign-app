'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ReviewList from '@/components/ReviewList';
import AddReviewForm from '@/components/AddReviewForm';
import QuantitySelector from '@/components/QuantitySelector';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const id = pathname ? pathname.split('/')[2] : null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (id && isClient) {
      setLoading(true);
      Promise.all([
        fetch('http://localhost:5000/products').then(res => res.json()),
        fetch('http://localhost:5000/reviews').then(res => res.json())
      ])
        .then(([products, allReviews]) => {
          const foundProduct = products.find((p) => p.id.toString() === id);
          const productReviews = allReviews.filter((r) => r.productId.toString() === id);
          if (foundProduct) {
            setProduct(foundProduct);
            setReviews(productReviews);
          } else {
            setError('Product not found');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isClient]);

  const handleAddToCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/cart');
      const existingItems = await res.json();
  
      if (!existingItems || !Array.isArray(existingItems) || !product || !product.id) {
        console.error("Error: existingItems or product information is missing");
        return;
      }
  
      // Check if product already exists in cart by comparing id (used as product.id)
      const existingItem = existingItems.find(item => item.id.toString() === product.id.toString());
  
      if (existingItem) {
        // Delete the existing item
        const deleteRes = await fetch(`http://localhost:5000/cart/${product.id}`, {
          method: 'DELETE',
        });
        if (!deleteRes.ok) throw new Error('Failed to remove existing cart item');
      }
  
      // Add item with new quantity (id will be product.id)
      const addRes = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id.toString(),  // use product.id as cart item's id
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        }),
      });
  
      if (!addRes.ok) throw new Error('Failed to add item to cart');
  
      alert('Item added/updated in cart!');
    } catch (err) {
      console.error(err);
      alert('Could not add item to cart.');
    }
  };
  
  
  
  
  
  
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  const total = (product.price * quantity).toFixed(2);

  return (
    <div className="container my-4">
      <h4>Total: ${total}</h4>
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description || 'No description available.'}</p>
          <p className="fw-bold">${product.price}</p>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <button className="btn btn-primary mt-2 me-2" onClick={handleAddToCart}>Add to Cart</button>
          <button className="btn btn-outline-secondary mt-2" onClick={() => router.push('/cart')}>Go to Cart</button>
        </div>
      </div>

      <hr />

      <h4>Customer Reviews</h4>
      <ReviewList reviews={reviews} />
      <AddReviewForm productId={product.id} onNewReview={(review) => setReviews([...reviews, review])} />
    </div>
  );
}
