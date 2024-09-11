import React, { useState } from "react";
import classes from "../edit-product/edit-product.module.scss";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import uploadImage from "assets/images/upload.svg";
import closeIcon from "assets/images/close.png";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Spinner from "components/Spinner";
import API from "api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProduct = () => {
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    brand: "",
    colors: [],
    price: "",
    gender: "male",
    category: "shorts",
    quantity: "",
    imageUrl: "",
  });

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [file, setFile] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductDetails({
      ...productDetails,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    });
  };

  const handleCheckbox = (event) => {
    const currentState = productDetails.colors;
    const itemIndex = currentState.indexOf(event.target.value);
    if (itemIndex > -1) {
      currentState.splice(itemIndex, 1);
    } else {
      currentState.push(event.target.value);
    }
    setProductDetails({ ...productDetails, colors: currentState });
  };

  const colors = ["black", "white", "blue"];

  const colorCheckboxes = colors.map((color, index) => {
    return (
      <div className={classes.radioWrapper} key={index}>
        <label htmlFor={color}>
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </label>
        <input
          type="checkbox"
          id={color}
          onChange={handleCheckbox}
          value={color}
        />
      </div>
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionLoading(true);

    if (
      !productDetails.brand ||
      !productDetails.category ||
      !productDetails.colors.length ||
      !productDetails.name ||
      !productDetails.price ||
      !productDetails.quantity ||
      !productDetails.description ||
      !productDetails.gender
    ) {
      setSubmissionLoading(false);
      console.log("please complete all the fields");
      return;
    }

    // IMAGE UPLOAD
    let imageURL = "";

    const formData = new FormData();
    formData.append("image", file);
    setFileUploadLoading(true);

    //GETTING THE IMAGE URL
    await API.post("/products/upload", formData)
      .then((res) => {
        console.log(res);
        setFileUploadLoading(false);
        imageURL = res.data.imageURL;
        console.log("imageURL", imageURL);
        setFile("");
      })
      .catch((err) => {
        setFileUploadLoading(false);
        console.log(err);
      });

    //CREATING THE PRODUCT
    await API.post("/products", { ...productDetails, imageUrl: imageURL })
      .then((res) => {
        setSubmissionLoading(false);
        setProductDetails({
          name: "",
          description: "",
          brand: "",
          colors: [],
          price: "",
          gender: "male",
          category: "shorts",
          quantity: "",
          imageUrl: "",
        });
        toast.success("Product Created");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
        setSubmissionLoading(false);
      });
  };

  return (
    <div className={classes.editProduct}>
      <div className={classes.head}>
      <h3>Create Product</h3>{" "}
      </div>
      <form className={classes.productCard} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <div className={classes.inputWrapper}>
              <label htmlFor="">Product Name</label>
              <input
                type="text"
                name="name"
                value={productDetails.name}
                onChange={handleChange}
                id=""
              />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <label htmlFor="">Gender</label>
            <div className={classes.genderContainer}>
              <div className={classes.radioWrapper}>
                <label htmlFor="male">Male</label>
                <input
                  type="radio"
                  id="male"
                  value="male"
                  name="gender"
                  onChange={handleChange}
                />
              </div>
              <div className={classes.radioWrapper}>
                <label htmlFor="female">Female</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  onChange={handleChange}
                  value="female"
                />
              </div>
              <div className={classes.radioWrapper}>
                <label htmlFor="unisex">Unisex</label>
                <input
                  value="unisex"
                  id="unisex"
                  type="radio"
                  name="gender"
                  onChange={handleChange}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className={classes.inputWrapper}>
              <label htmlFor="">Description</label>
              <input
                type="text"
                name="description"
                value={productDetails.description}
                onChange={handleChange}
                id=""
              />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <label htmlFor="">Colors</label>
            <div className={classes.genderContainer}>{colorCheckboxes}</div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className={classes.inputWrapper}>
              <label htmlFor="">Brand</label>
              <input
                type="text"
                name="brand"
                value={productDetails.brand}
                onChange={handleChange}
                id=""
              />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth>
              <label htmlFor="" className="mb-1">
                Category
              </label>
              <Select
                size="small"
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    category: e.target.value,
                  })
                }
                value={productDetails.category}
              >
                <MenuItem value="shoes">Shoes</MenuItem>
                <MenuItem defaultValue="" value="shorts">
                  Shorts
                </MenuItem>
                <MenuItem defaultValue="" value="tanks">
                  Tanks
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={6}>
            <div className={classes.inputWrapper}>
              <label htmlFor="">Quantity</label>
              <input
                type="number"
                min={0}
                name="quantity"
                value={productDetails.quantity}
                onChange={handleChange}
                id=""
              />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className={classes.inputWrapper}>
              <label htmlFor="">Price</label>
              <input
                type="number"
                min={0}
                name="price"
                value={productDetails.price}
                onChange={handleChange}
                id=""
              />
            </div>
          </Grid>
          <Grid item xs={6} md={6}>
            <div className={classes.fileInputArea}>
              <input
                type="file"
                name=""
                id=""
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
              />
              <div className={classes.imageWrapper}>
                <img src={uploadImage} alt="upload" />
              </div>
              <div className={classes.content}>
                <h3>Drop or Select file</h3>
                <p>Drop files here or click browse thorough your machine</p>
              </div>
            </div>
            <div className={classes.filesPreview}>
              {productDetails?.imageUrl && (
                <div className={classes.imagePreview}>
                  <div className={classes.closeIconWrapper}>
                    <img className={classes.closeIcon} src={closeIcon} alt="" />
                  </div>
                  <img
                    className={classes.fileImage}
                    src={productDetails.imageUrl}
                    alt=""
                  />
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <div className={classes.saveButtonWrapper}>
              <button className={classes.saveButton} type="submit">
                {submissionLoading ? <Spinner /> : "Create"}
              </button>
            </div>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateProduct;
