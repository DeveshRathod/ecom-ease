import Stripe from "stripe";
import Order from "../database/models/order.model.js";
import User from "../database/models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const stripe = new Stripe(
  "sk_test_51PVVKZRsvxoA0WXZtXc6oZgGOJ1XZ4kAW0CDY8ITWk73QZEKGMpTdkHCwIiB7zSiM1CbsrYHDnlB8N0IuE5KMJTp00CZtRGdYi"
);

const generateOrderId = () => {
  return "SE" + Math.random().toString(36).slice(2, 12).toUpperCase();
};

const generateNotification = (message, sender) => {
  return {
    message,
    sender,
    date: new Date(),
    notificationId: uuidv4(),
    status: "Unread",
  };
};

export const pay = async (req, res) => {
  const { totalAmount, product, typeOfPayment, userId, address, url } =
    req.body;
  const currentUser = req.user;

  const calculateFinalPrice = (price, discount) => {
    if (discount >= 0 && discount <= 100) {
      const discountedPrice = price * (1 - discount / 100);
      return discountedPrice;
    } else {
      return price;
    }
  };

  const transactionId = uuidv4();
  const orderId = generateOrderId();

  const createOrderInMongo = async (session) => {
    const order = new Order({
      userId,
      products: product,
      totalAmount,
      address,
      typeOfPayment,
      transactionId,
      orderId,
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
        success_url: "https://shopease-36jj.onrender.com/orders",
        cancel_url: url,
      });

      const createdOrderId = await createOrderInMongo(session);

      const user = await User.findById(userId).session(session);
      const userNotification = generateNotification(
        `Your order with ID: ${orderId} has been placed.`,
        `${currentUser.username} (User)`
      );

      await User.findByIdAndUpdate(
        userId,
        {
          $push: { orders: createdOrderId, notifications: userNotification },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const admins = await User.find({ isAdmin: true });
      const adminNotification = generateNotification(
        `New order placed with ID: ${orderId}`,
        `${userId} (User)`
      );
      admins.forEach(async (admin) => {
        admin.notifications.push(adminNotification);
        await admin.save();
      });

      res.status(200).json({ url: sessionStripe.url, product });
    } else {
      const createdOrderId = await createOrderInMongo(session);

      const user = await User.findById(userId).session(session);
      const userNotification = generateNotification(
        `Your order with ID: ${orderId} has been placed.`,
        `System (Admin)`
      );

      await User.findByIdAndUpdate(
        userId,
        {
          $push: { orders: createdOrderId, notifications: userNotification },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const admins = await User.find({ isAdmin: true });
      const adminNotification = generateNotification(
        `New order placed with ID: ${orderId}`,
        `${userId} (User)`
      );
      admins.forEach(async (admin) => {
        admin.notifications.push(adminNotification);
        await admin.save();
      });

      res.status(200).json({ url: "http://localhost:5173/orders" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: error.message });
  }
};
