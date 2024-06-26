import Stripe from "stripe";
import Order from "../database/models/order.model.js";
import User from "../database/models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const stripe = new Stripe(
  "sk_test_51PVVKZRsvxoA0WXZtXc6oZgGOJ1XZ4kAW0CDY8ITWk73QZEKGMpTdkHCwIiB7zSiM1CbsrYHDnlB8N0IuE5KMJTp00CZtRGdYi"
);

export const pay = async (req, res) => {
  const { totalAmount, product, typeOfPayment, userId, address } = req.body;

  const calculateFinalPrice = (price, discount) => {
    if (discount >= 0 && discount <= 100) {
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice;
    } else {
      return price;
    }
  };

  const transactionId = uuidv4();

  const createOrderInMongo = async (session) => {
    const order = new Order({
      userId,
      products: product,
      totalAmount,
      address,
      typeOfPayment,
      transactionId,
    });

    await order.save({ session });
    return order._id;
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (typeOfPayment === "Stripe") {
      const line_items = product.map((product) => {
        let amount = calculateFinalPrice(product.price, product.discount);

        if (totalAmount < 500) {
          amount += 40;
        }

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              images: [product.image],
              description: product.brand,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        };
      });

      const sessionStripe = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        success_url: "http://localhost:5173/",
        cancel_url: "http://localhost:5173/setting",
      });

      const orderId = await createOrderInMongo(session);

      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: orderId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ url: sessionStripe.url, product });
    } else {
      const orderId = await createOrderInMongo(session);

      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: orderId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ url: "http://localhost:5173/orders" }); // Adjust URL as needed
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
};
