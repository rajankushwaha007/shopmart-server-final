const Product = require("../models/product.model")
const Newsletter = require("../models/newsletter.model")
const mailer = require("../helper/mailer.helper")

const fs = require("fs")
async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        if (req.files)
            data.pic = Array.from(req.files).map(x => x.path)
        await data.save()

        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })

        let newsletters = await Newsletter.find({ status: true })
        newsletters.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: x?.email,
                subject: `New Product Available : Team ${process.env.SITE_NAME}`,
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
                                                Something New Has Arrived!
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px;text-align:center;">

                                            <p style="margin:0 0 10px;color:#0d6efd;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">
                                                New Arrival
                                            </p>

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:26px;">
                                                Checkout ${finalData.name}
                                            </h2>

                                            <p style="margin:0 auto 25px;max-width:500px;font-size:16px;line-height:28px;color:#555555;">
                                                Hello <strong>Our Valuable Customer</strong>, we're excited to introduce one of our latest products at <strong>${process.env.SITE_NAME}</strong>. Discover great quality, modern style, and excellent value—all in one product.
                                            </p>

                                            <!-- Product Image -->
                                            <div style="margin:25px 0;">
                                                <img src="${process.env.SITE_URL}/${finalData.pic[0]}" alt="${finalData.name}" width="520" style="display:block;width:100%;max-width:520px;height:auto;margin:0 auto;border-radius:8px;border:1px solid #eeeeee;">
                                            </div>

                                            <!-- Product Details -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;text-align:left;">

                                                <tr>
                                                    <td style="background-color:#f1f5f9;padding:15px;font-size:18px;font-weight:bold;color:#222222;">
                                                        ${finalData.name}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:20px;background-color:#fafafa;font-size:15px;line-height:26px;color:#555555;">
                                                        ${finalData.description}
                                                    </td>
                                                </tr>

                                            </table>

                                            <!-- Price -->
                                            <div style="margin:25px 0;">

                                                <span style="font-size:15px;color:#888888;text-decoration:line-through;">
                                                    ₹${finalData.basePrice}
                                                </span>

                                                <span style="margin-left:10px;font-size:26px;font-weight:bold;color:#198754;">
                                                    ₹${finalData.finalPrice}
                                                </span>

                                            </div>

                                            <p style="margin:0 0 25px;font-size:14px;color:#777777;">
                                                ${finalData.discount}% OFF · Limited-time offer
                                            </p>

                                            <!-- CTA -->
                                            <div style="margin:35px 0;">

                                                <a href="${process.env.SITE_URL}/product/${finalData._id}" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:15px 35px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                    Shop Now
                                                </a>

                                            </div>

                                            <p style="margin:25px 0;font-size:15px;line-height:26px;color:#666666;">
                                                Don't miss out! Explore this new arrival today and add it to your cart before the offer ends or stock runs out.
                                            </p>

                                            <div style="background-color:#fff8e1;border-left:4px solid #ffc107;padding:15px 18px;text-align:left;margin:25px 0;">
                                                <p style="margin:0;font-size:14px;line-height:23px;color:#665c3b;">
                                                    <strong>Special Offer:</strong> Enjoy ${finalData.discount}% off on this product for a limited time. Offer availability may vary.
                                                </p>
                                            </div>

                                            <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                Happy Shopping! 🛍️
                                                <br><br>
                                                <strong>${process.env.SITE_NAME} Team</strong>
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                            You are receiving this email because you subscribed to the ${process.env.SITE_NAME} newsletter.

                                            <br><br>

                                            <a href="${process.env.SITE_URL}/unsubscribe/${x._id}" style="color:#0d6efd;text-decoration:none;">
                                                Unsubscribe
                                            </a>

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
        })
    } catch (error) {
        console.log(error)
        if (req.files) {
            Array.from(req.files).forEach(x => {
                try {
                    fs.unlinkSync(x.path)
                } catch (error) { }
            })
        }

        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Product.find()
            .sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
        res.send({
            result: "Done",
            data: data,
            count: data.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body?.name ?? data.name
            data.maincategory = req.body?.maincategory ?? data.maincategory
            data.subcategory = req.body?.subcategory ?? data.subcategory
            data.brand = req.body?.brand ?? data.brand
            data.color = req.body?.color ?? data.color
            data.size = req.body?.size ?? data.size
            data.basePrice = req.body?.basePrice ?? data.basePrice
            data.discount = req.body?.discount ?? data.discount
            data.finalPrice = req.body?.finalPrice ?? data.finalPrice
            data.description = req.body?.description ?? data.description
            data.stock = req.body?.stock ?? data.stock
            data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
            data.status = req.body?.status ?? data.status
            if (await data.save()) {
                if (req.body?.oldPics && req.body?.oldPics.length) {
                    data.pic?.forEach((x) => {
                        if (!req.body?.oldPics?.includes(x)) {
                            try {
                                fs.unlinkSync(x)
                            } catch (error) { }
                        }
                    })
                    data.pic = req.body?.oldPics
                }
                else {
                    data.pic?.forEach((x) => {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) { }
                    })
                    data.pic = []
                }

                if (req.files && req.files?.length !== 0) {
                    data.pic = data.pic.concat(Array.from(req.files).map(x => x.path))
                }
                await data.save()
            }

            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({
                result: "Done",
                data: finalData
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
        if (req.files) {
            Array.from(req.files).forEach(x => {
                try {
                    fs.unlinkSync(x.path)
                } catch (error) { }
            })
        }
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function updateRecordByUser(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.stock = req.body?.stock ?? data.stock
            data.stockQuantity = req.body?.stockQuantity ?? data.stockQuantity
            await data.save()

            let finalData = await Product.findOne({ _id: data._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({
                result: "Done",
                data: finalData
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "No Such Record Exist"
            })
        }
    } catch (error) {
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            data.pic?.forEach(x => {
                try {
                    fs.unlinkSync(x)
                } catch (error) { }
            })

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
    getSingleRecord,
    updateRecord,
    updateRecordByUser,
    deleteRecord
}