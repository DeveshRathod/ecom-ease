import Product from "../database/models/product.model.js";
import User from "../database/models/user.model.js";

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

// export const getAllNonAdminUsers = async (req, res) => {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const todayEnd = new Date();
//     todayEnd.setHours(23, 59, 59, 999);

//     const nonAdminUsers = await User.find({ isAdmin: false });

//     const simplifiedUsers = nonAdminUsers.map((user) => ({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       gender: user.gender,
//       mobile: user.mobile,
//       profile: user.profile,
//       birthday: user.birthday,
//       createdAt: user.createdAt,
//       createdToday: user.createdAt >= todayStart && user.createdAt <= todayEnd,
//     }));

//     const totalLength = simplifiedUsers.length;
//     const maleCount = simplifiedUsers.filter(
//       (user) => user.gender === "M"
//     ).length;
//     const femaleCount = simplifiedUsers.filter(
//       (user) => user.gender === "F"
//     ).length;

//     const todaysUsers = simplifiedUsers.filter((user) => user.createdToday);
//     todaysUsers.sort((a, b) => b.createdAt - a.createdAt);
//     const todaysUsersLength = todaysUsers.length;

//     const result = {
//       totalLength,
//       todaysUsersLength,
//       genderCount: {
//         male: maleCount,
//         female: femaleCount,
//       },
//       allUsers: simplifiedUsers,
//       todaysUsers,
//     };

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error("Error fetching non-admin users:", error);
//     return res.status(500).json({ message: "Failed to fetch non-admin users" });
//   }
// };

export const getAllNonAdminUsers = async (req, res) => {
  let { searchquery, page } = req.query;
  let limit = 10;
  let filter = { isAdmin: false };

  try {
    let nonAdminUsers;
    let skip = 0;

    if (page && !isNaN(page)) {
      skip = (parseInt(page) - 1) * limit;
    }

    if (!searchquery || searchquery.trim() === "") {
      // If searchquery is empty or whitespace, return all non-admin users
      nonAdminUsers = await User.find(filter).skip(skip).limit(limit);
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
