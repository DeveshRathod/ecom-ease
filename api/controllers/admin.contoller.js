import Brand from "../database/models/brands.model.js";
import Product from "../database/models/product.model.js";
import User from "../database/models/user.model.js";

export const addBrand = async (req, res) => {
  const { name, description, image, category } = req.body;
  const isAdmin = req.user.isAdmin;

  console.log(req.body);

  if (!isAdmin) {
    return res.status(403).json({ message: "Only admins can add products" });
  }

  if (!name || !description || !image || !category) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const brand = new Brand({
      name,
      description,
      image,
      category,
    });

    await brand.save();

    return res.status(201).json(brand);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(403).json({ message: "Only admins can add products" });
  }

  const {
    name,
    price,
    description,
    specifications,
    images,
    category,
    brand,
    sizes,
    stock,
    type,
  } = req.body;

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0" });
  }

  if (stock <= 0) {
    return res.status(400).json({ message: "Stock must be greater than 0" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      specifications,
      images,
      brand,
      stock,
      type,
      sizes,
    });
    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add product" + error.message });
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
    const { searchQuery, category, page, limit } = req.query;
    const query = {};

    if (searchQuery) {
      query.$text = { $search: searchQuery };
    }

    if (category) {
      query.category = category;
    }

    const pageSize = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;

    const products = await Product.find(query)
      .select("name images category brand stock type createdAt price")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllNonAdminUsers = async (req, res) => {
  let { searchquery, page, sortField, sortOrder } = req.query;
  let limit = 11;
  let filter = { isAdmin: false };

  try {
    let nonAdminUsers;
    let skip = 0;

    if (page && !isNaN(page)) {
      skip = (parseInt(page) - 1) * limit;
    }

    let sortOptions = {};
    if (sortField && sortOrder) {
      sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions["createdAt"] = 1;
    }

    if (!searchquery || searchquery.trim() === "") {
      nonAdminUsers = await User.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    } else {
      const searchString = searchquery.toString();
      nonAdminUsers = await User.find({
        $and: [
          filter,
          {
            $or: [
              { username: { $regex: searchString, $options: "i" } },
              { email: { $regex: searchString, $options: "i" } },
              { mobile: { $regex: searchString, $options: "i" } },
            ],
          },
        ],
      })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    }

    const simplifiedUsers = nonAdminUsers.map((user) => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      mobile: user.mobile,
      profile: user.profile,
      birthday: user.birthday,
      createdAt: user.createdAt,
    }));

    return res.status(200).json(simplifiedUsers);
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    return res.status(500).json({ message: "Failed to fetch non-admin users" });
  }
};
