//with changes in UI desgina and rst filter button
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) setCategories(data?.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  // Get products with pagination
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      setLoading(false);
      setProducts(page === 1 ? data.products : [...products, ...data.products]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  // Filter products
  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        { checked, radio }
      );
      setLoading(false);
      setProducts(data?.products || []);
    } catch (error) {
      setLoading(false);
      console.error("Error filtering products:", error);
      toast.error("Failed to filter products");
    }
  };

  // Handle category filter
  const handleFilter = (value, id) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  // Reset filters
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    setProducts([]); // Clear products temporarily
    getAllProducts(); // Fetch all products again
  };

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Initial load
  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts();
  }, []);

  // Load products when page changes
  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [page]);

  // Apply filters
  useEffect(() => {
    if (checked.length || radio.length) {
      setPage(1);
      filterProduct();
    }
  }, [checked, radio]);

  return (
    <Layout title="All Products - Best Offer">
      <div className="container-fluid py-4">
        <div className="row g-4">
          <aside className="col-md-3">
            <div className="card shadow-sm p-3">
              <h4 className="mb-3 text-primary">Filters</h4>
              <div className="mb-4">
                <h5 className="text-secondary mb-2">Categories</h5>
                <div className="d-flex flex-column gap-2">
                  {categories.map((c) => (
                    <Checkbox
                      key={c._id}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                      checked={checked.includes(c._id)}
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h5 className="text-secondary mb-2">Price Range</h5>
                <Radio.Group
                  onChange={(e) => setRadio(e.target.value)}
                  value={radio}
                  className="d-flex flex-column gap-2"
                >
                  {Prices?.map((p) => (
                    <Radio key={p._id} value={p.array}>
                      {p.name}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
              <button
                className="btn btn-outline-danger w-100"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </aside>
          <section className="col-md-9">
            <h2 className="text-center mb-4 text-primary">All Products</h2>
            {loading && page === 1 ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {products.map((p) => (
                    <div className="col" key={p._id}>
                      <div className="card h-100 shadow-sm hover-scale">
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          onError={(e) => {
                            e.target.src = "/images/fallback.jpg";
                          }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{p.name}</h5>
                          <p className="card-text text-muted">
                            {p.description.length > 30
                              ? `${p.description.substring(0, 30)}...`
                              : p.description}
                          </p>
                          <p className="card-text fw-bold text-success">
                            ${p.price.toFixed(2)}
                          </p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary flex-grow-1"
                              onClick={() => navigate(`/product/${p.slug}`)}
                            >
                              More Details
                            </button>
                            <button
                              className="btn btn-primary flex-grow-1"
                              onClick={() => {
                                setCart([...cart, p]);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify([...cart, p])
                                );
                                toast.success("Item Added to Cart");
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length < total && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-warning px-4 py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prev) => prev + 1);
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-grow spinner-grow-sm me-2"
                            role="status"
                          />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Checkbox, Radio } from "antd";
// import { Prices } from "./../components/Prices";
// import { useCart } from "../context/cart";

// const HomePage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useCart();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [checked, setChecked] = useState([]);
//   const [radio, setRadio] = useState([]);
//   const [total, setTotal] = useState(0); // Changed to a number
//   const [page, setPage] = useState(1); // Changed to a number
//   const [loading, setLoading] = useState(false);

//   // Get all categories
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/category/get-category`
//       );
//       if (data?.success) {
//         setCategories(data?.category);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in getting category");
//     }
//   };

//   // Get all products
//   const getAllProducts = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       setLoading(false);
//       if (page === 1) {
//         setProducts(data.products); // Set products for the first page
//       } else {
//         setProducts([...products, ...data.products]); // Append products for subsequent pages
//       }
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       toast.error("Something went wrong in getting products");
//     }
//   };

//   // Get total product count
//   const getTotal = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-count`
//       );
//       setTotal(data?.total || 0); // Ensure it's a number
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in getting total product count");
//     }
//   };

//   // Load more products
//   const loadmore = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
//         { headers: { "Cache-Control": "no-cache" } }
//       );
//       setLoading(false);
//       setProducts([...products, ...data.products]); // Append new products
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       toast.error("Something went wrong while loading more products");
//     }
//   };

//   // Filter by category
//   const handleFilter = (value, id) => {
//     let all = [...checked];
//     if (value) {
//       all.push(id);
//     } else {
//       all = all.filter((c) => c !== id);
//     }
//     setChecked(all);
//   };

//   // Get filtered products
//   const filterProduct = async () => {
//     try {
//       const { data } = await axios.post(
//         `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
//         { checked, radio }
//       );
//       setProducts(data?.products);
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong while filtering products");
//     }
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setChecked([]);
//     setRadio([]);
//     setPage(1); // Reset page to 1
//     getAllProducts(); // Fetch products for the first page
//   };

//   // Fetch categories and total count on component mount
//   useEffect(() => {
//     getAllCategory();
//     getTotal();
//     getAllProducts();
//   }, []);

//   // Fetch products when page changes
//   useEffect(() => {
//     if (page > 1) {
//       loadmore();
//     }
//   }, [page]);

//   // Fetch products when filters change
//   useEffect(() => {
//     if (!checked.length && !radio.length) {
//       setPage(1); // Reset page to 1
//       getAllProducts();
//     } else {
//       filterProduct();
//     }
//   }, [checked, radio]);

//   return (
//     <Layout title="All Products - Best Offer">
//       <div className="container mt-4">
//         <div className="row">
//           <aside className="col-md-3 p-3 bg-light rounded">
//             <h4 className="text-dark">Filters</h4>
//             <div className="mb-3">
//               <h5>By Category</h5>
//               {categories?.map((c) => (
//                 <Checkbox
//                   key={c._id}
//                   onChange={(e) => handleFilter(e.target.checked, c._id)}
//                 >
//                   {c.name}
//                 </Checkbox>
//               ))}
//             </div>
//             <div className="mb-3">
//               <h5>By Price</h5>
//               <Radio.Group onChange={(e) => setRadio(e.target.value)}>
//                 {Prices?.map((p, index) => (
//                   <Radio key={index} value={p.array}>
//                     {p.name}
//                   </Radio>
//                 ))}
//               </Radio.Group>
//             </div>
//             <button className="btn btn-danger w-100" onClick={resetFilters}>
//               Reset Filters
//             </button>
//           </aside>
//           <section className="col-md-9">
//             <h2 className="text-center mb-4">All Products</h2>
//             <div className="row">
//               {products?.map((p) => (
//                 <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={p._id}>
//                   <div className="card border-0 shadow-sm">
//                     <img
//                       src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
//                       className="card-img-top rounded-top"
//                       alt={p.name}
//                       onError={(e) => {
//                         e.target.src = "/path/to/fallback-image.jpg";
//                       }}
//                     />
//                     <div className="card-body">
//                       <h5 className="card-title">{p.name}</h5>
//                       <p className="card-text text-muted">
//                         {p.description.length > 30
//                           ? p.description.substring(0, 30) + "..."
//                           : p.description}
//                       </p>
//                       <h6 className="text-primary">$ {p.price}</h6>
//                       <div className="d-flex justify-content-between">
//                         <button
//                           className="btn btn-outline-primary"
//                           onClick={() => navigate(`/product/${p.slug}`)}
//                         >
//                           More Details
//                         </button>
//                         <button
//                           className="btn btn-primary"
//                           onClick={() => {
//                             setCart([...cart, p]);
//                             toast.success("Item Added to cart");
//                           }}
//                         >
//                           Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="m-2 p-3">
//               {products && products.length < total && (
//                 <button
//                   className="btn btn-warning"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setPage(page + 1);
//                   }}
//                   disabled={loading}
//                 >
//                   {loading ? "Loading ..." : "Loadmore"}
//                 </button>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;

//****************** */
// import React, { useState, useEffect, useCallback } from "react";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Checkbox, Radio } from "antd";
// import { Prices } from "./../components/Prices";

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [checked, setChecked] = useState([]);
//   const [radio, setRadio] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Get all categories
//   const getAllCategory = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/category/get-category`
//       );
//       if (data?.success) {
//         setCategories(data?.category);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in getting category");
//     }
//   };

//   // Get all products
//   const getAllProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
//         { timeout: 10000 } // Increase timeout
//       );
//       setLoading(false);
//       if (page === 1) {
//         setProducts(data.products);
//       } else {
//         setProducts([...products, ...data.products]);
//       }
//     } catch (error) {
//       setLoading(false);
//       if (error.code !== "ECONNABORTED") {
//         console.log(error);
//         toast.error("Something went wrong in getting products");
//       }
//     }
//   }, [page, products]);

//   // Get total product count
//   const getTotal = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-count`
//       );
//       setTotal(data?.total || 0);
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in getting total product count");
//     }
//   };

//   // Load more products
//   const loadmore = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`,
//         { timeout: 10000 } // Increase timeout
//       );
//       setLoading(false);
//       setProducts([...products, ...data.products]);
//     } catch (error) {
//       setLoading(false);
//       if (error.code !== "ECONNABORTED") {
//         console.log(error);
//         toast.error("Something went wrong while loading more products");
//       }
//     }
//   }, [page, products]);

//   // Filter by category
//   const handleFilter = (value, id) => {
//     let all = [...checked];
//     if (value) {
//       all.push(id);
//     } else {
//       all = all.filter((c) => c !== id);
//     }
//     setChecked(all);
//   };

//   // Get filtered products
//   const filterProduct = useCallback(async () => {
//     try {
//       const { data } = await axios.post(
//         `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
//         { checked, radio },
//         { timeout: 10000 } // Increase timeout
//       );
//       setProducts(data?.products);
//     } catch (error) {
//       if (error.code !== "ECONNABORTED") {
//         console.log(error);
//         toast.error("Something went wrong while filtering products");
//       }
//     }
//   }, [checked, radio]);

//   // Reset filters
//   const resetFilters = () => {
//     setChecked([]);
//     setRadio([]);
//     setPage(1);
//     getAllProducts();
//   };

//   // Fetch categories and total count on component mount
//   useEffect(() => {
//     const controller = new AbortController();
//     getAllCategory();
//     getTotal();
//     getAllProducts();

//     return () => {
//       controller.abort(); // Cleanup function
//     };
//   }, [getAllProducts]);

//   // Fetch products when page changes
//   useEffect(() => {
//     if (page > 1) {
//       loadmore();
//     }
//   }, [page, loadmore]);

//   // Fetch products when filters change
//   useEffect(() => {
//     if (!checked.length && !radio.length) {
//       setPage(1);
//       getAllProducts();
//     } else {
//       filterProduct();
//     }
//   }, [checked, radio, filterProduct, getAllProducts]);

//   return (
//     <Layout title="All Products - Best Offer">
//       <div className="container mt-4">
//         <div className="row">
//           <aside className="col-md-3 p-3 bg-light rounded">
//             <h4 className="text-dark">Filters</h4>
//             <div className="mb-3">
//               <h5>By Category</h5>
//               {categories?.map((c) => (
//                 <Checkbox
//                   key={c._id}
//                   onChange={(e) => handleFilter(e.target.checked, c._id)}
//                 >
//                   {c.name}
//                 </Checkbox>
//               ))}
//             </div>
//             <div className="mb-3">
//               <h5>By Price</h5>
//               <Radio.Group onChange={(e) => setRadio(e.target.value)}>
//                 {Prices?.map((p, index) => (
//                   <Radio key={index} value={p.array}>
//                     {p.name}
//                   </Radio>
//                 ))}
//               </Radio.Group>
//             </div>
//             <button className="btn btn-danger w-100" onClick={resetFilters}>
//               Reset Filters
//             </button>
//           </aside>
//           <section className="col-md-9">
//             <h2 className="text-center mb-4">All Products</h2>
//             <div className="row">
//               {products?.map((p) => (
//                 <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={p._id}>
//                   <div className="card border-0 shadow-sm">
//                     <img
//                       src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
//                       className="card-img-top rounded-top"
//                       alt={p.name}
//                       onError={(e) => {
//                         e.target.src = "/path/to/fallback-image.jpg";
//                       }}
//                     />
//                     <div className="card-body">
//                       <h5 className="card-title">{p.name}</h5>
//                       <p className="card-text text-muted">
//                         {p.description.length > 30
//                           ? p.description.substring(0, 30) + "..."
//                           : p.description}
//                       </p>
//                       <h6 className="text-primary">$ {p.price}</h6>
//                       <div className="d-flex justify-content-between">
//                         <button className="btn btn-outline-primary">
//                           More Details
//                         </button>
//                         <button className="btn btn-primary">Add to Cart</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="m-2 p-3">
//               {products && products.length < total && (
//                 <button
//                   className="btn btn-warning"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setPage(page + 1);
//                   }}
//                   disabled={loading}
//                 >
//                   {loading ? "Loading ..." : "Loadmore"}
//                 </button>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HomePage;
