import Product from "../database/models/product.model.js";

export const getAllNewArrival = async (req, res) => {
  const category = ["mobiles", "fashion", "electronics", "toys", "furniture"];
  try {
    const latestEntries = await Product.aggregate([
      { $match: { category: { $in: category } } },
      { $sort: { "entry.createdAt": -1 } },
      {
        $group: {
          _id: "$category",
          entry: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$entry" } },
    ]);

    const resultArray = category
      .map((cat) => latestEntries.find((entry) => entry.category === cat))
      .filter(Boolean);

    return res.status(200).json(resultArray);
  } catch (error) {
    console.error("Error fetching latest entries:", error);
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
