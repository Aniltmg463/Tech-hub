import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import Formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  Formidable(),
  createProductController
);

//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  Formidable(),
  updateProductController
);

// get all products
router.get("/get-product", getProductController);

// get single products
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/product/:pid", deleteProductController);

export default router;

// import express from "express";
// import {
//   createProductController,
//   updateProductController,
//   getProductController,
//   getSingleProductController,
//   productPhotoController,
//   deleteProductController,
// } from "../controllers/productController.js";
// import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
// import formidable from "express-formidable";

// const router = express.Router();

// //routes
// router.post(
//   "/create-product",
//   requireSignIn,
//   isAdmin,
//   formidable(),
//   createProductController
// );

// //routes
// router.put(
//   "/update-product/:pid",
//   requireSignIn,
//   isAdmin,
//   Formidable(),
//   updateProductController
// );

// // get products
// router.get("/get-product", getProductController);

// // get single products
// router.get("/get-product/:slug", getSingleProductController);

// //get photo
// router.get("/product-photo/:pid", productPhotoController);

// //delete product
// router.delete("/product/:pid", deleteProductController);

// export default router;
