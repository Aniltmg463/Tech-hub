import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Spinner } from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOK] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      //const res = await axios.get("/api/v1/auth/user-auth"); 
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/user-auth`
      ); //
      if (res.data.ok) {
        setOK(true);
      } else {
        setOK(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  return ok ? <Outlet /> : <Spinner />;
}

// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/auth";
// import { Outlet } from "react-router-dom";
// import axios from "axios";

// export default function PrivateRoute() {
//   const [ok, setOK] = useState(false);
//   const [auth] = useAuth(); // No need to destructure setAuth if not used

//   useEffect(() => {
//     // ✅ Fixed extra parenthesis
//     const authCheck = async () => {
//       try {
//         const res = await axios.get("/api/v1/auth/user-auth", {
//           headers: {
//             Authorization: auth?.token, // ✅ Proper authorization header
//           },
//         });

//         setOK(res.data.ok);
//       } catch (error) {
//         console.error("Auth check failed:", error);
//         setOK(false);
//       }
//     };

//     if (auth?.token) authCheck();
//   }, [auth?.token]); // ✅ Dependency array

//   return ok ? <Outlet /> : <div>Loading...</div>; // ✅ Use a proper spinner component
// }
