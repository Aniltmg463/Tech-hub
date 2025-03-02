import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [product, setProduct] = useState({ category: {} }); // Initialize with default category
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Initial product details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // Get product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1>ProductDetails</h1>
      {/* {JSON.stringify(product, null, 4)} */}

      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height={"300"}
            width={"350"}
            onError={(e) => {
              e.target.src = "/path/to/fallback-image.jpg"; // Fallback image
            }}
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Details</h1>
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>Price: {product.price}</h6>
          {/* Safely access category name */}
          <h6>Category: {product.category?.name}</h6>
          {/* <h6>Shipping: {product.shipping}</h6> */}
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center"> NO Similar Product found</p>
        )}
      </div>
      <div className="row">
        {/* {JSON.stringify(relatedProducts, null, 4)} */}

        <div className="row">
          {relatedProducts?.map((p) => (
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
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-primary">Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout/Layout";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const ProductDetails = () => {
//   const params = useParams();
//   const [product, setProduct] = useState({ category: {} }); // Initialize with default category
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   // Initial product details
//   useEffect(() => {
//     if (params?.slug) getProduct();
//   }, [params?.slug]);

//   // Get product details
//   const getProduct = async () => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
//       );
//       setProduct(data?.product);
//       getSimilarProduct(data?.product._id, data?.product.category._id);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //get similar product
//   const getSimilarProduct = async (pid, cid) => {
//     try {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
//       );
//       setRelatedProducts(data?.products);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Layout>
//       <h1>ProductDetails</h1>
//       {/* {JSON.stringify(product, null, 4)} */}

//       <div className="row container mt-2">
//         <div className="col-md-6">
//           <img
//             src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
//             className="card-img-top"
//             alt={product.name}
//             height={"300"}
//             width={"350"}
//             onError={(e) => {
//               e.target.src = "/path/to/fallback-image.jpg"; // Fallback image
//             }}
//           />
//         </div>
//         <div className="col-md-6 ">
//           <h1 className="text-center">Product Details</h1>
//           <h6>Name: {product.name}</h6>
//           <h6>Description: {product.description}</h6>
//           <h6>Price: {product.price}</h6>
//           {/* Safely access category name */}
//           <h6>Category: {product.category?.name}</h6>
//           {/* <h6>Shipping: {product.shipping}</h6> */}
//           <button className="btn btn-primary">Add to Cart</button>
//         </div>
//       </div>
//       <hr />
//       <div className="row container">
//         <h6>Similar Products</h6>
//         {relatedProducts.length < 1 && (
//           <p className="text-center"> NO Similar Product found</p>
//         )}
//       </div>
//       <div className="row">
//         {/* {JSON.stringify(relatedProducts, null, 4)} */}

//         <div className="row">
//           {relatedProducts?.map((p) => (
//             <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={p._id}>
//               <div className="card border-0 shadow-sm">
//                 <img
//                   src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top rounded-top"
//                   alt={p.name}
//                   onError={(e) => {
//                     e.target.src = "/path/to/fallback-image.jpg";
//                   }}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{p.name}</h5>
//                   <p className="card-text text-muted">
//                     {p.description.length > 30
//                       ? p.description.substring(0, 30) + "..."
//                       : p.description}
//                   </p>
//                   <h6 className="text-primary">$ {p.price}</h6>
//                   <div className="d-flex justify-content-between">
//                     <button className="btn btn-primary">Add to Cart</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProductDetails;
