import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "./../components/Prices";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0); // Changed to a number
  const [page, setPage] = useState(1); // Changed to a number
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setLoading(false);
      if (page === 1) {
        setProducts(data.products); // Set products for the first page
      } else {
        setProducts([...products, ...data.products]); // Append products for subsequent pages
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong in getting products");
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total || 0); // Ensure it's a number
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting total product count");
    }
  };

  // Load more products
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setLoading(false);
      setProducts([...products, ...data.products]); // Append new products
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong while loading more products");
    }
  };

  // Filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while filtering products");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1); // Reset page to 1
    getAllProducts(); // Fetch products for the first page
  };

  // Fetch categories and total count on component mount
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  // Fetch products when page changes
  useEffect(() => {
    if (page > 1) {
      loadmore();
    }
  }, [page]);

  // Fetch products when filters change
  useEffect(() => {
    if (!checked.length && !radio.length) {
      setPage(1); // Reset page to 1
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, radio]);

  return (
    <Layout title="All Products - Best Offer">
      <div className="container mt-4">
        <div className="row">
          <aside className="col-md-3 p-3 bg-light rounded">
            <h4 className="text-dark">Filters</h4>
            <div className="mb-3">
              <h5>By Category</h5>
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            <div className="mb-3">
              <h5>By Price</h5>
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p, index) => (
                  <Radio key={index} value={p.array}>
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <button className="btn btn-danger w-100" onClick={resetFilters}>
              Reset Filters
            </button>
          </aside>
          <section className="col-md-9">
            <h2 className="text-center mb-4">All Products</h2>
            <div className="row">
              {products?.map((p) => (
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={p._id}>
                  <div className="card border-0 shadow-sm">
                    <img
                      src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top rounded-top"
                      alt={p.name}
                      onError={(e) => {
                        e.target.src = "/path/to/fallback-image.jpg";
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">
                        {p.description.length > 30
                          ? p.description.substring(0, 30) + "..."
                          : p.description}
                      </p>
                      <h6 className="text-primary">$ {p.price}</h6>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-primary">
                          More Details
                        </button>
                        <button className="btn btn-primary">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading ..." : "Loadmore"}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
