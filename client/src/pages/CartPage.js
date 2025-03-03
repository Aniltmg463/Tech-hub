import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //delete items
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="conatiner">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your Cart is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width={"100px"}
                    height={"100px"}
                    onError={(e) => {
                      e.target.src = "/images/fallback.jpg";
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <p>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price: {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;

//try1
// import React from "react";
// import Layout from "../components/Layout/Layout";
// import { useAuth } from "../context/auth";
// import { useCart } from "../context/cart";
// import { useNavigate } from "react-router-dom";

// const CartPage = () => {
//   const [auth, setAuth] = useAuth();
//   const [cart, setCart] = useCart();
//   const navigate = useNavigate();

//   return (
//     <Layout>
//       <div className="container">
//         <div className="row">
//           <div className="col-md-12">
//             <h1 className="text-center bg-light p-2 mb-1">
//               {`Hello ${auth?.token && auth?.user?.name}`}
//             </h1>
//             <h4 className="text-center">
//               {cart?.length > 0
//                 ? `You Have ${cart.length} items in your cart ${
//                     auth?.token ? "" : "Please login to checkout"
//                   }`
//                 : "Your Cart is Empty"}
//             </h4>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-9">
//             {cart?.map((p) => (
//               <div className="row mb-3" key={p._id}>
//                 {" "}
//                 {/* Add a unique key */}
//                 <div className="col-md-4">
//                   <img
//                     src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
//                     alt={p.name}
//                     className="img-fluid rounded"
//                     onError={(e) => {
//                       e.target.src = "/images/fallback.jpg"; // Fallback image
//                     }}
//                   />
//                 </div>
//                 <div className="col-md-8">
//                   <h5>{p.name}</h5>
//                   <p className="text-muted">
//                     {p.description.substring(0, 50)}...
//                   </p>
//                   <p className="fw-bold">${p.price.toFixed(2)}</p>
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => {
//                       // Remove item from cart
//                       setCart(cart.filter((item) => item._id !== p._id));
//                     }}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="col-md-3">
//             <h4>Checkout | Payment</h4>
//             {auth?.token ? (
//               <button
//                 className="btn btn-primary w-100"
//                 onClick={() => navigate("/checkout")}
//               >
//                 Proceed to Checkout
//               </button>
//             ) : (
//               <button
//                 className="btn btn-primary w-100"
//                 onClick={() => navigate("/login")}
//               >
//                 Login to Checkout
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CartPage;
