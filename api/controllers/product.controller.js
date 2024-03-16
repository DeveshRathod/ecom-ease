import Product from "../database/models/product.model.js";

export const getAllNewArrival = async (req, res) => {
  try {
    const latestEntries = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$category",
          entry: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$entry" } },
    ]);

    const latestEntriesObject = {};
    latestEntries.forEach((entry) => {
      latestEntriesObject[entry.category] = entry;
    });

    const all = { data: latestEntriesObject };

    return res.status(200).json(all.data);
  } catch (error) {
    console.error("Error fetching latest entries:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
