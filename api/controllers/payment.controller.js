import Stripe from "stripe";
import Order from "../database/models/order.model.js";
import User from "../database/models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { Address } from "../database/models/address.model.js";

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
  const {
    totalAmount,
    product,
    typeOfPayment,
    userId,
    address,
    successURL,
    cancelURL,
  } = req.body;

  const currentUser = req.user;
  const transactionId = uuidv4();
  const orderId = generateOrderId();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the full address document using the provided address ObjectId
    const addressDoc = await Address.findById(address).session(session);
    if (!addressDoc) throw new Error("Address not found");

    // Construct the full address object from the fetched address
    const fullAddress = {
      type: addressDoc.type,
      name: addressDoc.name,
      mobile: addressDoc.mobile,
      addressLine1: addressDoc.addressLine1,
      addressLine2: addressDoc.addressLine2,
      addressLine3: addressDoc.addressLine3,
      pincode: addressDoc.pincode,
    };

    const createOrderInMongo = async () => {
      const order = new Order({
        userId,
        products: product,
        totalAmount,
        addressId: address, // Store the address ID as a reference
        address: fullAddress, // Store the full address in the `address` field
        typeOfPayment,
        transactionId,
        orderId,
      });
      await order.save({ session });
      return order._id;
    };

    if (typeOfPayment === "Stripe") {
      const line_items = product.map((item) => {
        let amount = item.price * (1 - (item.discount || 0) / 100);
        if (totalAmount < 500) amount += 40;

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              images: [item.image],
              description: item.brand,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        };
      });

      const sessionStripe = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: successURL,
        cancel_url: cancelURL,
      });

      const createdOrderId = await createOrderInMongo();

      const userNotification = generateNotification(
        `Your order with ID: ${orderId} has been placed.`,
        `${currentUser?.username || "System"} (User)`
      );

      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: createdOrderId, notifications: userNotification } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const admins = await User.find({ isAdmin: true });
      const adminNotification = generateNotification(
        `New order placed with ID: ${orderId}`,
        `${userId} (User)`
      );

      for (const admin of admins) {
        admin.notifications.push(adminNotification);
        await admin.save();
      }

      return res.status(200).json({ url: sessionStripe.url, product });
    } else {
      const createdOrderId = await createOrderInMongo();

      const userNotification = generateNotification(
        `Your order with ID: ${orderId} has been placed.`,
        `System (Admin)`
      );

      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: createdOrderId, notifications: userNotification } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const admins = await User.find({ isAdmin: true });
      const adminNotification = generateNotification(
        `New order placed with ID: ${orderId}`,
        `${userId} (User)`
      );

      for (const admin of admins) {
        admin.notifications.push(adminNotification);
        await admin.save();
      }

      return res.status(200).json({ url: successURL });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error in pay controller:", error);
    return res.status(500).json({ error: error.message });
  }
};
