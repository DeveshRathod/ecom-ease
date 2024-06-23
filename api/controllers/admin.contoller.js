import Brand from "../database/models/brands.model.js";
import Product from "../database/models/product.model.js";
import User from "../database/models/user.model.js";
import Order from "../database/models/order.model.js";

export const addBrand = async (req, res) => {
  const { name, url } = req.body;
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ message: "Only admins can add products" });
  }

  if (!name || !url) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const brandId = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    const brand = new Brand({
      brandId,
      name,
      url,
    });

    await brand.save();

    return res.status(201).json(brand);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const removeBrand = async (req, res) => {
  const { brandId, brandName } = req.body;

  if (!brandId || !brandName) {
    return res.status(400).json({ error: "Brand ID and name are required" });
  }

  try {
    const brand = await Brand.findOne({ brandId, name: brandName });

    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found or name does not match the ID" });
    }

    const productResult = await Product.deleteMany({ brand: brandName });

    const brandResult = await Brand.deleteOne({
      name: brandName,
      brandId: brandId,
    });

    res.status(200).json({
      message: `${productResult.deletedCount} product(s) deleted and the brand has been removed`,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while removing the brand and its products",
    });
  }
};

export const fetchAllBrandNames = async (req, res) => {
  try {
    const brands = await Brand.find({}, "name url brandId products");
    const brandData = brands.map((brand) => ({
      name: brand.name,
      url: brand.url,
      brandId: brand.brandId,
      products: brand.products,
    }));
    res.status(200).json({ brandData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the brand names" });
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
    brand: brandName,
    sizes,
    stock,
    type,
    returnable,
    refundable,
    openbox,
    warranty,
  } = req.body;

  if (!returnable && refundable) {
    return res
      .status(400)
      .json({ message: "Non returnable cannot be refundable" });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0" });
  }

  if (stock <= 0) {
    return res.status(400).json({ message: "Stock must be greater than 0" });
  }

  try {
    let brand = await Brand.findOne({ name: brandName });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brand.products++;

    await brand.save();

    const product = new Product({
      name,
      price,
      description,
      category,
      specifications,
      images,
      brand: brandName,
      stock,
      type,
      sizes,
      returnable,
      refundable,
      openbox,
      warranty,
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
    return res.status(403).json({ message: "Not an Admin" });
  }

  if (!productId) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const brandName = product.brand;

    await Brand.updateOne({ name: brandName }, { $inc: { products: -1 } });

    const deletedProduct = await Product.findByIdAndDelete(productId);

    return res.status(200).json(deletedProduct);
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
    returnable,
    refundable,
    openbox,
    warranty,
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
        returnable,
        refundable,
        openbox,
        warranty,
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
    const { searchQuery, category } = req.query;
    const query = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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

    const simplifiedUsers = nonAdminUsers;
    return res.status(200).json(simplifiedUsers);
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    return res.status(500).json({ message: "Failed to fetch non-admin users" });
  }
};

export const getDashboard = async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.isAdmin;

  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!isAdmin) {
    return res.status(403).json({ message: "Not an Admin" });
  }

  try {
    const userCount = await User.countDocuments({ isAdmin: false });

    const productCount = await Product.countDocuments();

    const pendingOrdersCount = await Order.countDocuments({
      status: "pending",
    });

    const completedOrdersCount = await Order.countDocuments({
      status: "completed",
    });

    return res.status(200).json({
      userCount,
      productCount,
      pendingOrdersCount: pendingOrdersCount || 0,
      completedOrdersCount: completedOrdersCount || 0,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const isAdmin = req.user.isAdmin;
  const userId = req.body.userId;

  try {
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized, admin access required" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addUser = async (req, res) => {
  const isAdmin = req.user.isAdmin;

  try {
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized, admin access required" });
    }

    const user = new User(req.body);

    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
