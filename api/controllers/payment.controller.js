import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51PVVKZRsvxoA0WXZtXc6oZgGOJ1XZ4kAW0CDY8ITWk73QZEKGMpTdkHCwIiB7zSiM1CbsrYHDnlB8N0IuE5KMJTp00CZtRGdYi"
);

export const pay = async (req, res) => {
  const { totalAmount, product, customerId } = req.body;

  try {
    const line_items = product.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          images: product.images[0].images[0].url,
          description: product.description,
        },
        unit_amount: product.unit_amount,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: "http://localhost:5173/",
      cancel_url: "http://localhost:5173/setting",
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
