import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name, email, password, address, phone);
    //toast.success("Register Successfull", { autoClose: 3000 });

    setTimeout(() => {
      toast.success("Register Successful!");
    }, 500); // Delays toast by 500ms

    //**************************** */
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address, answer }
      );
      //console.log("API Response:", res);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");

        // setTimeout(() => {
        //   toast.success(res.data.message);
        //   navigate("/login");
        // }, 3000);
      } else {
        toast.error(res.data.message);
      }
      //**************************** */

      //...................................//
      // if (res && res.data.success) {
      //   toast.success(res.data && res.data.message);
      //   navigate("/login");
      // } else {
      //   toast.error(res.data.message);
      // }
      //...................................//
    } catch (error) {
      console.log(error);
      toast.error("Somwthing went wrong");
    }
  };

  return (
    <Layout title="Register Tech Hub App">
      <div className="register">
        <h1>Register Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="name"
              placeholder="Enter Your Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="email"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="password"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              id="phone"
              placeholder="Enter Your Phone"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              id="address"
              placeholder="Enter Your Address"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="answer"
              placeholder="What is Your Favorite sports"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};
