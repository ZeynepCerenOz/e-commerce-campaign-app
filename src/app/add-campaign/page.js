'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [discountedProductIds, setDiscountedProductIds] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const campaign = {
      title,
      description,
      image,
      discountedProductIds: discountedProductIds.split(',').map(id => parseInt(id.trim()))
    };

    await fetch('http://localhost:5000/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });

    router.push('/'); // Go back to home page
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Add New Campaign</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Campaign Title</label>
          <input type="text" className="form-control" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" required value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="url" className="form-control" required value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Discounted Product IDs (comma separated)</label>
          <input type="text" className="form-control" required value={discountedProductIds} onChange={(e) => setDiscountedProductIds(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary">Add Campaign</button>
      </form>
    </div>
  );
}
