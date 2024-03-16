import Product from "../database/models/product.model.js";

export const getAllNewArrival = async (req, res) => {
  const category = ["Mobile", "Fashion", "Electronics", "Toys"];
  try {
    const latestEntries = await Product.aggregate([
      { $match: { category: { $in: category } } },
      { $sort: { createdAt: -1 } },
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
