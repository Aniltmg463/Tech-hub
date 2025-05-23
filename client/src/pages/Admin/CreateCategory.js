// import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout/Layout";
// import AdminMenu from "../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import CategoryForm from "../../components/Form/CategoryForm";
// import { Modal } from "antd";

// const CreateCategory = () => {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [updatedName, setUpdatedName] = useState("");

//   //handle From
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         `${process.env.REACT_APP_API}/api/v1/category/create-category`,
//         { name }
//       );
//       if (data?.success) {
//         toast.success(`${name} is created`);
//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong in input form");
//     }
//   };

//   //get all categories
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
//       toast.error("Something weny wrong in getting category");
//     }
//   };

//   useEffect(() => {
//     getAllCategory();
//   }, []);

//   //update CAtegory
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       //console.log(e);
//       const { data } = await axios.put(
//         `${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`,
//         { name: updatedName }
//       );
//       if (data.success) {
//         toast.success(`${updatedName} is updated`); //24:00
//         setSelected(null);
//         setUpdatedName("");
//         setVisible(false);
//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Something went wrong while updating Category");
//     }
//   };

//   //delete Category
//   const handleDelete = async (pId) => {
//     try {
//       //console.log(e)
//       const { data } = await axios.delete(
//         `${process.env.REACT_APP_API}/api/v1/category/delete-category/${pId}`
//       );
//       if (data.success) {
//         toast.success(`${name} is Deleted`);
//         getAllCategory();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Something went wrong while updating Category");
//     }
//   };

//   return (
//     <Layout title={"Dashboard - All Create Category"}>
//       <div className="container-fluid m-3 p-3">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <h1>Manage Category</h1>
//             <div className="p-3 w-50">
//               <CategoryForm
//                 handleSubmit={handleSubmit}
//                 value={name}
//                 setValue={setName}
//               />
//             </div>
//             <div className="w-75">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th scope="col">Name</th>
//                     <th scope="col">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {categories?.map((c) => (
//                     <>
//                       <tr>
//                         <td key={c._id}>{c.name}</td>
//                         <td>
//                           <button
//                             className="btn btn-primary ms-2"
//                             onClick={() => {
//                               setVisible(true);
//                               setUpdatedName(c.name);
//                               setSelected(c); //added
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn btn-danger ms-2"
//                             onClick={() => {
//                               handleDelete(c._id);
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     </>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <Modal
//               onCancel={() => setVisible(false)}
//               footer={null}
//               visible={visible}
//             >
//               <CategoryForm
//                 value={updatedName}
//                 setValue={setUpdatedName}
//                 handleSubmit={handleUpdate}
//               />
//             </Modal>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CreateCategory;

// // import React, { useEffect, useState } from "react";
// // import Layout from "../../components/Layout/Layout";
// // import AdminMenu from "../../components/Layout/AdminMenu";
// // import toast from "react-hot-toast";
// // import axios from "axios";

// // const CreateCategory = () => {
// //   const [categories, setCategories] = useState([]);

// //   //get all categories
// //   const getAllCategory = async () => {
// //     try {
// //       const { data } = await axios.get(
// //         `${process.env.REACT_APP_API}/api/v1/category/get-category`
// //       );
// //       if (data.success) {
// //         setCategories(data.category);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       toast.error("Something weny wrong in getting category");
// //     }
// //   };

// //   useEffect(() => {
// //     getAllCategory();
// //   }, []);

// //   return (
// //     <Layout title={"Dashboard - All Create Category"}>
// //       <div className="container-fluid m-3 p-3">
// //         <div className="row">
// //           <div className="col-md-3">
// //             <AdminMenu />
// //           </div>
// //           <div className="col-md-9">
// //             <h1>Manage Category</h1>
// //             <div>
// //               <table className="table">
// //                 <thead>
// //                   <tr>
// //                     <th scope="col">Name</th>
// //                     <th scope="col">Actions</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   <tr>
// //                     {categories.map((c) => (
// //                       <td key={c._id}>{c.name}</td>
// //                     ))}
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default CreateCategory;

//************try */
import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/category/create-category`,
        { name }
      );
      if (data?.success) {
        toast.success("Category created successfully");
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Create Category</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
