import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  return (
    <Layout
      title="Home Page"
      description="Welcome to the Tech Hub website, your go-to platform for the latest in technology."
      keywords="technology, programming, react, mern, seo"
      author="Tech Anil"
    >
      <h1>Home Page</h1>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
    </Layout>
  );
};

export default HomePage;
