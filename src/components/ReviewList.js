export default function ReviewList({ reviews }) {
    return (
      <ul className="list-group mb-4">
        {reviews.map((review, index) => (
          <li className="list-group-item" key={index}>
            <strong>{review.title}</strong>
            <div className="text-muted mb-1">by {review.username || "Anonymous"}</div>
            <div>
              {'⭐'.repeat(review.rating)}{' '}
              <span className="text-muted">({review.rating}/5)</span>
            </div>
            <p>{review.text}</p>
          </li>
        ))}
      </ul>
    );
  }
  