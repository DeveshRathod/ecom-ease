import Brand from "../database/models/brands.model.js";
import Product from "../database/models/product.model.js";
import User from "../database/models/user.model.js";

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const getAllNewArrival = async (req, res) => {
  const categories = ["mobiles", "travels", "electronics", "toys"];
  try {
    const latestEntries = await Product.aggregate([
      { $match: { category: { $in: categories } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          latestEntry: { $first: "$$ROOT" },
        },
      },
    ]);

    const resultArray = categories
      .map((cat) => {
        const foundEntry = latestEntries.find((entry) => entry._id === cat);
        return foundEntry ? foundEntry.latestEntry : null;
      })
      .filter(Boolean);

    return res.status(200).json(resultArray);
  } catch (error) {
    console.error("Error fetching latest entries:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLatestFurnitureProduct = async (req, res) => {
  try {
    const latestFurnitureProduct = await Product.findOne({
      category: "furniture",
    }).sort({ createdAt: -1 });

    if (!latestFurnitureProduct) {
      return res.status(404).json({ message: "No furniture products found" });
    }

    return res.status(200).json(latestFurnitureProduct);
  } catch (error) {
    console.error("Error fetching latest furniture product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllFashion = async (req, res) => {
  try {
    const latestProduct = await Product.findOne({ category: "fashion" }).sort({
      createdAt: -1,
    });

    if (!latestProduct) {
      return res.status(404).json({ message: "No fashion products found" });
    }

    const { brand } = latestProduct;

    const productTypes = ["male", "female", "kids"];

    const latestProductsByType = await Product.aggregate([
      { $match: { brand, category: "fashion" } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$type",
          latestEntry: { $first: "$$ROOT" },
        },
      },
      { $match: { _id: { $in: productTypes } } },
    ]);

    const resultArray = productTypes
      .map((type) => {
        const foundEntry = latestProductsByType.find(
          (entry) => entry._id === type
        );
        return foundEntry ? foundEntry.latestEntry : null;
      })
      .filter(Boolean);

    return res.status(200).json({ resultArray, brand });
  } catch (error) {
    console.error(
      "Error fetching latest fashion products by brand and type:",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const exploreProducts = async (req, res) => {
  const { category, searchQuery, type, page } = req.query;
  const limit = 8;
  const skip = (page - 1) * limit;

  try {
    let matchStage = {};
    if (category && category.toLowerCase() !== "all") {
      matchStage.category = category;
    }

    if (type && type.toLowerCase() !== "all") {
      matchStage.type = type;
    }

    if (searchQuery) {
      matchStage.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { brand: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const count = await Product.countDocuments(matchStage);

    const products = await Product.find(matchStage)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error exploring products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCurrentProduct = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const product = await Product.findById(productId);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItems = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const products = user.cart;

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, colorIndex } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    user.cart.push({
      productId: productId,
      name: product.name,
      image: product.images[colorIndex].images[0].url,
      colorName: product.images[colorIndex].name,
      colorIndex: colorIndex,
      price: product.price,
      brand: product.brand,
      discount: product.discount,
      stock: product.stock,
      sold: product.sold,
    });

    await user.save();

    return res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, colorIndex } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let indexToDelete = -1;
    for (let i = 0; i < user.cart.length; i++) {
      const product = user.cart[i];
      if (
        product.productId === productId &&
        product.colorIndex === colorIndex
      ) {
        indexToDelete = i;
        break;
      }
    }

    if (indexToDelete !== -1) {
      user.cart.splice(indexToDelete, 1);
      await user.save();
    }

    return res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const suggestion = async (req, res) => {
  const { searchQuery } = req.query;

  if (
    !searchQuery ||
    searchQuery.trim() === "" ||
    /[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|]/.test(searchQuery)
  ) {
    return res.json([]);
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: escapeRegex(searchQuery), $options: "i" } },
        { brand: { $regex: escapeRegex(searchQuery), $options: "i" } },
      ],
    }).limit(4);

    const suggestions = products.map((product) => {
      const discount = product.discount || 0;
      const discountedPrice = product.price - (product.price * discount) / 100;
      return {
        name: product.name,
        price: discountedPrice.toFixed(2),
      };
    });

    res.json(suggestions);
  } catch (error) {
    console.error("Error searching for suggestions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allImages = async (req, res) => {
  try {
    const images = await Brand.find();

    const imageUrls = images.map((image) => image.url);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
