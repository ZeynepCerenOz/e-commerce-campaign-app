'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Optional: Sync input when URL changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 py-2 mb-3 shadow-sm">
      <Link className="navbar-brand fw-bold fs-4" href="/">My Shop</Link>

      <div className="ms-auto d-flex align-items-center">
        <form className="d-flex me-3" onSubmit={handleSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-primary ms-2" type="submit">Search</button>
        </form>

        <Link className="btn btn-outline-dark" href="/cart">
          🛒 Cart
        </Link>
      </div>
    </nav>
  );
}
