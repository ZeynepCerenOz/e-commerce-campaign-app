'use client';


import { useEffect, useState } from 'react';
import QuantitySelector from '@/components/QuantitySelector';

export default function CartPage() {
 
  const [cartItems, setCartItems] = useState([]);
  const [specialNotes, setSpecialNotes] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/cart');
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove item');

      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error(err);
      alert('Could not remove item from cart.');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const updatedItem = await res.json();

      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Could not update quantity.');
    }
  };

  const emptyCart = async () => {
    try {
      // Step 1: Fetch all cart items
      const res = await fetch('http://localhost:5000/cart');
      if (!res.ok) throw new Error('Failed to fetch cart items');
  
      const cartItems = await res.json();
  
      // Step 2: Delete each item by ID
      const deletePromises = cartItems.map(item =>
        fetch(`http://localhost:5000/cart/${item.id}`, {
          method: 'DELETE',
        })
      );
  
      // Wait for all deletions to finish
      await Promise.all(deletePromises);
  
      // Step 3: Update frontend state
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert('Failed to empty cart.');
    }
  };
  
  
  

  const calculateCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleNoteChange = (itemId, note) => {
    setSpecialNotes(prev => ({ ...prev, [itemId]: note }));
  };

  const handleCheckout = () => {
    setShowSummary(true);
  };

  const handlePayment = async () => {
    await emptyCart();
    setShowSummary(false);
    alert('Payment successful! Your cart has been cleared.');
  };

  const totalPrice = calculateCartTotal();
  const deliveryPrice = totalPrice < 1000 ? 50 : 0;
  const totalToPay = totalPrice + deliveryPrice;

  return (
    <div className="container">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : showSummary ? (
        <div className="mt-4">
          <h4>Order Summary</h4>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <p>Delivery Price: ${deliveryPrice.toFixed(2)}</p>
          <h5>Total to Pay: ${totalToPay.toFixed(2)}</h5>
          <button className="btn btn-success" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            {cartItems.map(item => (
              <div className="col-md-4" key={item.id}>
                <div className="card m-2" style={{ width: '18rem' }}>
                  <img
                    src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    className="card-img-top"
                    alt={item.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Price: ${item.price}</p>
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(val) => updateQuantity(item.id, val)}
                    />
                    <textarea
                      className="form-control mt-2"
                      placeholder="Special note (e.g., gift wrapping)"
                      value={specialNotes[item.id] || ''}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    />
                    <p className="card-text fw-bold">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-end">
            <h4>Total Cart Value: ${totalPrice.toFixed(2)}</h4>
            {deliveryPrice > 0 && <p>Delivery Fee: ${deliveryPrice.toFixed(2)}</p>}
            <h5>Total To Pay: ${totalToPay.toFixed(2)}</h5>
            <button className="btn btn-warning me-2" onClick={emptyCart}>
              Empty Cart
            </button>
            <button className="btn btn-success" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
