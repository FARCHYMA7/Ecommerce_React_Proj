const router = require('express').Router();
const { Order } = require('../models/Order');
const { User } = require('../models/User');
const verifyToken = require('../utils/verifyToken');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

router.get('/myorders', verifyToken(['user']), async (req, res) => {
    const myOrders = await Order.find({ user: new ObjectId(req.user._id) })
        .populate({
            path: 'user',
            select: {
                _id: 1, username: 1, firstname: 1, lastname: 1, email: 1, role: 1,
            },
        })
        .populate({
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');

    return res.send(myOrders);
});

router.get('/getOrder/:id', verifyToken(['admin', 'user']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed product id');
    }

    const order = await Order.findById(req.params.id)
        .populate({
            path: 'user',
            select: {
                _id: 1, firstname: 1, lastname: 1, email: 1, role: 1, address: 1, phone: 1,
            },
        })
        .populate({
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');
    if (!order) {
        return res.status(400).send('order not found');
    }
    return res.send(order);
});

// Endpoint to get order statistics (count and total price) for each user
router.get('/report', verifyToken(['admin']), async (req, res) => {
    try {
        const generalReport = Order.aggregate([
            {
                $group: {
                    _id: "$user",
                    orderCount: { $sum: 1 },
                    totalOrderPrice: { $sum: "$totalPrice" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    userName: { $concat: ["$userDetails.firstname", " ", "$userDetails.lastname"] },
                    orderCount: 1,
                    totalOrderPrice: 1
                }
            },
            {
                $sort: {
                    orderCount: -1  // Sorting by order count in descending order
                }
            }
        ]);

        const monthlyReport = Order.aggregate([
            {
                $group: {
                    _id: {
                        user: "$user",
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    orderCount: { $sum: 1 },
                    totalOrderPrice: { $sum: "$totalPrice" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id.user",
                    userName: { $concat: ["$userDetails.firstname", " ", "$userDetails.lastname"] },
                    yearMonth: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
                    orderCount: 1,
                    totalOrderPrice: 1
                }
            },
            {
                $sort: {
                    "yearMonth": 1, 
                }
            }
        ]);

        const [report, reportMonth] = await Promise.all([generalReport, monthlyReport]);

        return res.send({ report, reportMonth });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'An error occurred while generating the report.' });
    }
});

module.exports = router;