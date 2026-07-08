import Service from "../models/Service.js";
import ServiceOrder from "../models/ServiceOrder.js";
import crypto from "crypto";

// POST /api/orders/create
export const createOrder = async (req, res) => {
  try {
    const { serviceId, paymentMethod = "upi" } = req.body;
    const userId = req.user._id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const order = new ServiceOrder({
      user: userId,
      service: serviceId,
      amount: service.price,
      paymentMethod,
      paymentStatus: "pending",
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        service: {
          _id: service._id,
          name: service.name,
          price: service.price,
        },
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// POST /api/orders/verify
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    const userId = req.user._id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await ServiceOrder.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Accept transactionId from user (UPI reference number they enter after payment)
    const resolvedTxnId = transactionId || `UPI-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

    order.paymentStatus = "completed";
    order.transactionId = resolvedTxnId;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: {
        _id: order._id,
        paymentStatus: order.paymentStatus,
        transactionId: order.transactionId,
        amount: order.amount,
      },
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};

// GET /api/orders/history
export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await ServiceOrder.find({ user: userId })
      .populate("service", "name description price badge icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ success: false, message: "Failed to fetch purchase history" });
  }
};
