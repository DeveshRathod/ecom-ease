import Product from "../database/models/product.model.js";

export const addProduct = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(404).json({ message: "Not an Admin" });
  }

  const {
    name,
    price,
    description,
    specification,
    images,
    category,
    brand,
    stock,
  } = req.body;

  if (
    !name ||
    !price ||
    !description ||
    !specification ||
    !images ||
    !category ||
    !brand ||
    !stock
  ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  if (stock <= 0) {
    return res.status(400).json({ message: "Invalid stock" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      specification,
      images,
      category,
      brand,
      stock,
    });
    await product.save();
    const all = await Product.find();
    return res.status(200).json(all);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;
  const productId = req.params.productId;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(404).json({ message: "Not an Admin" });
  }

  if (!productId) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;
  const productId = req.params.productId;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(404).json({ message: "Not an Admin" });
  }

  if (!productId) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const product = await Product.findById(productId);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;
  const productId = req.params.productId;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(404).json({ message: "Not an Admin" });
  }

  if (!productId) {
    return res.status(404).json({ message: "Product not found" });
  }

  const {
    name,
    price,
    description,
    specification,
    images,
    category,
    brand,
    stock,
  } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        specification,
        images,
        category,
        brand,
        stock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
