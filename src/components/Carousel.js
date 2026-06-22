'use client';
import { useEffect, useState } from 'react';

export default function Carousel() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/campaigns')
      .then(res => res.json())
      .then(data => setCampaigns(data))
      .catch(err => console.error('Error fetching campaigns:', err));
  }, []);

  if (campaigns.length === 0) return null;

  return (
    <div id="campaignCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-inner">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <img
              src={campaign.image}
              className="d-block w-100"
              alt={campaign.title}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
              <h5>{campaign.title}</h5>
              <p>{campaign.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#campaignCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#campaignCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
