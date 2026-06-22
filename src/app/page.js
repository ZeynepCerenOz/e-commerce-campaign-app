'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'next/navigation';
import BootstrapClient from '../components/BootstrapClient';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Sort
    if (sortOption === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortOption, categoryFilter]);

  const handleCategoryChange = (e) => {
    // Reset search query and sort option when a new category is selected
    setCategoryFilter(e.target.value);
    setSortOption('');  // Reset the sort combobox
   
  };

  return (
    <>
      <BootstrapClient /> 
      <div className="container">
        <Carousel />

        {/* Search & Sort Row + Add Campaign Button */}
        <div className="d-flex justify-content-between align-items-center my-4">
          <h4 className="m-0">Products</h4>
          <div className="d-flex gap-2">
            <select
              className="form-select w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            <select
              className="form-select w-auto"
              value={categoryFilter}
              onChange={handleCategoryChange}
            >
              <option value="">Filter by Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>

            <button className="btn btn-outline-primary" onClick={() => router.push('/add-campaign')}>
              Add Campaign
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="row">
          {filteredProducts.map(product => (
            <div className="col-md-4 mb-4" key={product.id}>
              <ProductCard product={product} showQuantitySelector={false} />
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center text-muted">No products found.</div>
          )}
        </div>
      </div>
    </>
  );
}
