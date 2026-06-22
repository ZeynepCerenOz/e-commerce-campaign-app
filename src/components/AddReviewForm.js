import { useState } from "react";

export default function AddReviewForm({ productId, onNewReview }) {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      productId,
      username,
      title,
      text: review,
      rating
    };

    fetch('http://localhost:5000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    }).then(() => {
      onNewReview(newReview);
      setUsername("");
      setTitle("");
      setReview("");
      setRating(5);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="form-label">Username</label>
      <input
        className="form-control mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label className="form-label">Review Title</label>
      <input
        className="form-control mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label className="form-label">Your Review</label>
      <textarea
        className="form-control mb-2"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        required
      />

      <label className="form-label">Star Rating</label>
      <select
        className="form-control mb-2"
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((star) => (
          <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
        ))}
      </select>

      <button type="submit" className="btn btn-success">Submit Review</button>
    </form>
  );
}
