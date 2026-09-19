const Newsletter = require("../models/newsletter.model")
const mailer = require("../helper/mailer.helper")

async function createRecord(req, res) {
    try {
        let data = new Newsletter(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data?.email,
            subject: `Newsletter Subscription Confirmed : Team ${process.env.SITE_NAME}`,
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
                                                Newsletter Subscription
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px;text-align:center;">

                                            <!-- Success Icon -->
                                            <div style="margin-bottom:25px;">
                                                <div style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:50%;background-color:#d1e7dd;color:#198754;font-size:30px;font-weight:bold;">
                                                    ✓
                                                </div>
                                            </div>

                                            <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                You're Successfully Subscribed!
                                            </h2>

                                            <p style="margin:0 auto 20px;max-width:500px;font-size:16px;line-height:28px;color:#555555;">
                                                Hello <strong>Our Valuable Customer</strong>,
                                            </p>

                                            <p style="margin:0 auto 25px;max-width:500px;font-size:16px;line-height:28px;color:#555555;">
                                                Thank you for subscribing to the <strong>${process.env.SITE_NAME}</strong> newsletter. Your subscription has been successfully confirmed.
                                            </p>

                                            <!-- Benefits -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;text-align:left;">

                                                <tr>
                                                    <td style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;text-align:center;">
                                                        What You Can Expect
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding:20px 25px;background-color:#fafafa;font-size:14px;line-height:27px;color:#555555;">
                                                        ✓ Exclusive offers and special discounts<br>
                                                        ✓ Latest product updates and arrivals<br>
                                                        ✓ Seasonal sales and promotional deals<br>
                                                        ✓ Helpful shopping tips and recommendations
                                                    </td>
                                                </tr>

                                            </table>

                                            <p style="margin:25px auto;font-size:15px;line-height:26px;color:#666666;">
                                                We’re excited to have you as part of the ${process.env.SITE_NAME} community. Keep an eye on your inbox for our latest updates, offers, and exciting deals.
                                            </p>

                                            <!-- CTA -->
                                            <div style="margin:35px 0;">

                                                <a href="${process.env.SITE_URL}" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                    Start Shopping
                                                </a>

                                            </div>

                                            <p style="margin:0;font-size:14px;line-height:24px;color:#888888;">
                                                You can unsubscribe from our newsletter at any time using the unsubscribe link included in our emails.
                                            </p>

                                            <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                <strong>Thank you for joining us!</strong>
                                                <br><br>
                                                Best Regards,<br>
                                                ${process.env.SITE_NAME} Team
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                            You are receiving this email because you subscribed to the ${process.env.SITE_NAME} newsletter.

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
    } catch (error) {
        let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `This Email Address is Already Registered With Us`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
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
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.status = req.body.status ?? data.status
            await data.save()
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

async function unsubscribe(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.status = false
            await data.save()
            res.send({
                result: "Done",
                result: "Newsletter Unsubscribed"
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

async function deleteRecord(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
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
    getSingleRecord,
    updateRecord,
    deleteRecord,
    unsubscribe
}