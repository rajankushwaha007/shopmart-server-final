const Checkout = require("../models/checkout.model")
const mailer = require("../helper/mailer.helper")
const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body)
        await data.save()

        let finalData = await Checkout.findOne({ _id: data._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })

        let products = finalData.products?.map((item, index) => {
            return `
                <tr>
                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;">
                        ${item.product?.name}
                    </td>

                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;">
                        ${item.product?.brand?.name}
                    </td>

                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;">
                        ${item.color}
                    </td>

                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;">
                        ${item.size}
                    </td>

                     <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;text-align:right;">
                        ₹${item.product?.finalPrice}
                    </td>

                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;color:#333333;text-align:center;">
                        ${item.quantity}
                    </td>

                    <td style="padding:12px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#333333;text-align:right;">
                        ₹${item.total}
                    </td>
                </tr>
            `
        }).join("")

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: finalData.deliveryAddress?.email,
            subject: `Your Order Has Been Placed : Team ${process.env.SITE_NAME}`,
            html: `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                        <tr>
                            <td align="center">

                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e3e6ea;border-radius:8px;overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#0d6efd;padding:30px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>

                                            <p style="margin:8px 0 0;color:#dbe9ff;font-size:15px;">
                                                Order Confirmation
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px;">

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                Thank You, ${finalData.deliveryAddress?.name}! 🎉
                                            </h2>

                                            <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                Your order has been <strong>successfully placed</strong> with ${process.env.SITE_NAME}. We appreciate your purchase and will keep you updated as your order moves through the delivery process.
                                            </p>

                                            <!-- Order Summary -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Order Details
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="width:40%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order ID
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        #${finalData._id}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order Date
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.createdAt.toLocaleString()}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Payment Method
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.paymentMode}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                        Total Amount
                                                    </td>

                                                    <td style="padding:12px 15px;font-size:15px;font-weight:bold;color:#0d6efd;">
                                                        ₹${data.total}
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- Products -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td colspan="4" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Ordered Products
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;">
                                                        Product
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Brand
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Color
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Size
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:right;">
                                                        Price
                                                    </td>

                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Qty
                                                    </td>

                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:right;">
                                                        Total
                                                    </td>
                                                </tr>

                                            ${products}

                                            </table>

                                            <!-- Price Summary -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td style="padding:8px 0;font-size:14px;color:#666666;">
                                                        Subtotal
                                                    </td>

                                                    <td style="padding:8px 0;font-size:14px;color:#333333;text-align:right;">
                                                        ₹${finalData.subtotal}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:8px 0;font-size:14px;color:#666666;">
                                                        Shipping
                                                    </td>

                                                    <td style="padding:8px 0;font-size:14px;color:#333333;text-align:right;">
                                                        ₹${finalData.shipping}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 0;border-top:2px solid #eeeeee;font-size:17px;font-weight:bold;color:#222222;">
                                                        Total
                                                    </td>

                                                    <td style="padding:12px 0;border-top:2px solid #eeeeee;font-size:17px;font-weight:bold;color:#0d6efd;text-align:right;">
                                                        ₹${finalData.total}
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- Delivery Address -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Delivery Address
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:15px;background-color:#fafafa;font-size:14px;line-height:24px;color:#555555;">
                                                        <h5>${finalData.deliveryAddress?.address}</h5>
                                                        <p>${finalData.deliveryAddress?.pin} , ${finalData.deliveryAddress?.city}${finalData.deliveryAddress?.state}</p>
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- CTA -->
                                            <div style="text-align:center;margin:35px 0;">

                                                <a href="${process.env.SITE_URL}/profile?option=Orders" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                    View Your Order
                                                </a>

                                            </div>

                                            <p style="margin:0;font-size:15px;line-height:26px;color:#555555;">
                                                We will send you another notification when your order is shipped. If you have any questions regarding your order, please contact our customer support team.
                                            </p>

                                            <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                <strong>Thank you for shopping with ${process.env.SITE_NAME}!</strong>
                                                <br><br>
                                                Best Regards,<br>
                                                ${process.env.SITE_NAME} Customer Support Team
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                            This is an automated order confirmation email from ${process.env.SITE_NAME}.

                                            <br><br>

                                            © 2026 <strong>${process.env.SITE_NAME}</strong>. All Rights Reserved.

                                            <br>

                                            ${process.env.SITE_URL}

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>        
                `
        }, (error) => {
            console.log(error)
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: process.env.MAIL_USERNAME,
            subject: `New Order Received : Team ${process.env.SITE_NAME}`,
            html: `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                        <tr>
                            <td align="center">

                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e3e6ea;border-radius:8px;overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#198754;padding:30px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>

                                            <p style="margin:8px 0 0;color:#dff5e8;font-size:15px;">
                                                New Order Received
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px;">

                                            <div style="background-color:#d1e7dd;border-radius:6px;padding:15px;margin-bottom:25px;text-align:center;">
                                                <p style="margin:0;color:#146c43;font-size:16px;font-weight:bold;">
                                                    🎉 A New Order Has Been Placed!
                                                </p>
                                            </div>

                                            <h2 style="margin:0 0 15px;color:#222222;font-size:22px;">
                                                New Customer Order
                                            </h2>

                                            <p style="margin:0 0 25px;font-size:15px;line-height:26px;color:#555555;">
                                                A customer has successfully placed a new order on the <strong>${process.env.SITE_NAME}</strong> website. Please review the order details below and process the order accordingly.
                                            </p>

                                            <!-- Order Details -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:25px;">

                                                <tr>
                                                    <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Order Details
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="width:40%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order ID
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        #${finalData._id}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order Date
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.createdAt?.toLocaleString()}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Payment Method
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.paymentMode}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order Total
                                                    </td>

                                                    <td style="padding:12px 15px;font-size:16px;font-weight:bold;color:#198754;">
                                                        ₹${finalData.total}
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- Customer Details -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:25px;">

                                                <tr>
                                                    <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Customer Details
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="width:40%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Name
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.deliveryAddress?.name}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Email
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${finalData.deliveryAddress?.email}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                        Phone
                                                    </td>

                                                    <td style="padding:12px 15px;font-size:14px;color:#333333;">
                                                        ${finalData.deliveryAddress?.phone}
                                                    </td>
                                                </tr>

                                            </table>

                                           <!-- Products -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td colspan="4" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Ordered Products
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;">
                                                        Product
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Brand
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Color
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Size
                                                    </td>

                                                     <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:right;">
                                                        Price
                                                    </td>

                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:center;">
                                                        Qty
                                                    </td>

                                                    <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:bold;color:#555555;text-align:right;">
                                                        Total
                                                    </td>
                                                </tr>

                                            ${products}

                                            </table>


                                            <!-- Delivery Address -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:25px;">

                                                <tr>
                                                    <td style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Delivery Address
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:15px;background-color:#fafafa;font-size:14px;line-height:25px;color:#555555;">
                                                        <h5>${finalData.deliveryAddress?.address}</h5>
                                                        <p>${finalData.deliveryAddress?.pin} , ${finalData.deliveryAddress?.city}${finalData.deliveryAddress?.state}</p>
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- CTA -->
                                            <div style="text-align:center;margin:35px 0;">

                                                <a href="${process.env.SITE_URL}/admin" style="display:inline-block;background-color:#198754;color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:5px;font-size:15px;font-weight:bold;">
                                                    View Order in Admin Panel
                                                </a>

                                            </div>

                                            <p style="margin:0;font-size:14px;line-height:24px;color:#777777;">
                                                Please review the order and begin the fulfillment process as soon as possible.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                            This is an automated notification from the ${process.env.SITE_NAME} website.

                                            <br><br>

                                            © 2026 <strong>${process.env.SITE_NAME}</strong>. All Rights Reserved.

                                            <br>

                                            ${process.env.SITE_URL}

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>        
                `
        }, (error) => {
            console.log(error)
        })
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {
        console.log(error)
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Checkout.find().sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: data,
            count: data.length
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params.user }).sort({ _id: -1 })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: data,
            count: data.length
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}
async function getSingleRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data) {
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()
            res.send({
                result: "Done",
                data: data
            })

            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: data.deliveryAddress?.email,
                subject: `Order Status Updated : Team ${process.env.SITE_NAME}`,
                html: `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                        <tr>
                            <td align="center">

                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e3e6ea;border-radius:8px;overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#0d6efd;padding:30px;text-align:center;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>

                                            <p style="margin:8px 0 0;color:#dbe9ff;font-size:15px;">
                                                Order Status Update
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px;">

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                Hello ${data.deliveryAddress?.name},
                                            </h2>

                                            <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                We wanted to let you know that the status of your <strong>${process.env.SITE_NAME}</strong> order has been updated.
                                            </p>

                                            <!-- Status Box -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;border-collapse:collapse;">
                                                <tr>
                                                    <td style="background-color:#f1f5f9;border:1px solid #dbe2ea;border-radius:6px;padding:25px;text-align:center;">

                                                        <p style="margin:0 0 10px;font-size:13px;color:#777777;text-transform:uppercase;letter-spacing:1px;">
                                                            Current Order Status
                                                        </p>

                                                        <p style="margin:0;color:#0d6efd;font-size:25px;font-weight:bold;">
                                                            ${data.orderStatus}
                                                        </p>

                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Order Details -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                <tr>
                                                    <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                        Order Details
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="width:40%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Order ID
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        #${data._id}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                        Updated On
                                                    </td>

                                                    <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                        ${data.updatedAt?.toLocaleString()}
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- Status Message -->
                                            <div style="background-color:#f8f9fa;border-left:4px solid #0d6efd;padding:16px 18px;margin:25px 0;">
                                                <p style="margin:0;font-size:14px;line-height:24px;color:#555555;">
                                                    ${data.orderStatus}
                                                </p>
                                            </div>

                                            <!-- CTA -->
                                            <div style="text-align:center;margin:35px 0;">

                                                <a href="${process.env.SITE_URL}/profile?option=Orders" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                    Track Your Order
                                                </a>

                                            </div>

                                            <p style="margin:0;font-size:15px;line-height:26px;color:#555555;">
                                                If you have any questions regarding your order, please contact our customer support team. We're always happy to help.
                                            </p>

                                            <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                <strong>Thank you for shopping with ${process.env.SITE_NAME}!</strong>
                                                <br><br>
                                                Best Regards,<br>
                                                ${process.env.SITE_NAME} Customer Support Team
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                            This is an automated order status notification from ${process.env.SITE_NAME}.

                                            <br><br>

                                            © 2026 <strong>${process.env.SITE_NAME}</strong>. All Rights Reserved.

                                            <br>

                                            ${process.env.SITE_URL}

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>        
                `
            }, (error) => {
                console.log(error)
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        console.log(error)
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.send({
            result: "Done"
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord,
    getRecord,
    getUserRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    order,
    verifyOrder
}