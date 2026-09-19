const ContactUs = require("../models/contactus.model")
const mailer = require("../helper/mailer.helper")

async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })

        mailer.sendMail({
            from: process.env.MAIL_USERNAME,
            to: data.email,
            subject: `Your Query Has Been Received : Team ${process.env.SITE_NAME}`,
            html: `
                 <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                    <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e5e5e5;overflow:hidden;">

                                <!-- Header -->
                                <tr>
                                    <td align="center" style="background:#0d6efd;padding:30px;">
                                        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                            ${process.env.SITE_NAME}
                                        </h1>
                                        <p style="margin:8px 0 0;color:#dbe9ff;font-size:15px;">
                                            Thank You for Contacting Us
                                        </p>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding:40px;">

                                        <h2 style="margin-top:0;color:#222222;font-size:24px;">
                                            Hello ${data.name},
                                        </h2>

                                        <p style="font-size:16px;line-height:28px;margin:20px 0;">
                                            Thank you for contacting <strong>${process.env.SITE_NAME}</strong>. We have successfully received your inquiry, and our customer support team is currently reviewing your message.
                                        </p>

                                        <p style="font-size:16px;line-height:28px;margin:20px 0;">
                                            We aim to respond to all customer queries within
                                            <strong>24–48 business hours</strong>. If your request requires additional information, one of our support representatives will reach out to you.
                                        </p>

                                        <table cellpadding="0" cellspacing="0" width="100%" style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:20px;margin:25px 0;">
                                            <tr>
                                                <td style="font-size:15px;line-height:26px;">
                                                    <strong>Reference Details</strong><br><br>

                                                    <strong>Reference ID:</strong> ${data._id}<br>
                                                    <strong>Subject:</strong> ${data.subject}<br>
                                                    <strong>Submitted On:</strong> ${data.createdAt}
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="font-size:16px;line-height:28px;">
                                            We appreciate your patience and thank you for choosing ${process.env.SITE_NAME}. Your satisfaction is important to us, and we'll do our best to assist you as quickly as possible.
                                        </p>

                                        <div style="text-align:center;margin:40px 0;">
                                            <a href="${process.env.SITE_NAME}" style="background:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;display:inline-block;">
                                                Visit ${process.env.SITE_NAME}
                                            </a>
                                        </div>

                                        <p style="font-size:16px;line-height:28px;margin-bottom:0;">
                                            Kind Regards,<br>
                                            <strong>${process.env.SITE_NAME} Customer Support Team</strong>
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background:#f8f9fa;padding:25px;text-align:center;font-size:13px;color:#777777;line-height:22px;">
                                        This is an automated confirmation email. Please do not reply to this message.
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
            subject: `New Contact Us Query Received : Team ${process.env.SITE_NAME}`,
            html: `
                 <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
                    <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0"
                                style="background-color:#ffffff;border:1px solid #e3e6ea;border-radius:8px;overflow:hidden;">

                                <!-- Header -->
                                <tr>
                                    <td style="background-color:#0d6efd;padding:25px 30px;text-align:center;">
                                        <h1 style="margin:0;color:#ffffff;font-size:26px;">
                                            ${process.env.SITE_NAME}
                                        </h1>
                                        <p style="margin:8px 0 0;color:#dbe9ff;font-size:14px;">
                                            New Contact Us Query Received
                                        </p>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding:35px 40px;">

                                        <h2 style="margin:0 0 20px;color:#222222;font-size:22px;">
                                            New Customer Inquiry
                                        </h2>

                                        <p style="margin:0 0 25px;font-size:15px;line-height:26px;color:#555555;">
                                            A new query has been submitted through the <strong>${process.env.SITE_NAME} Contact Us</strong> form.
                                            Please review the details below and respond to the customer as soon as possible.
                                        </p>

                                        <!-- Customer Details -->
                                        <table width="100%" cellpadding="0" cellspacing="0"
                                            style="border-collapse:collapse;margin-bottom:25px;">

                                            <tr>
                                                <td colspan="2"
                                                    style="background-color:#f1f5f9;padding:12px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                    Customer Details
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    style="width:35%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                    Name
                                                </td>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                    ${data.name}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                    Email
                                                </td>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                    ${data.email}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                    Phone
                                                </td>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                   ${data.phone}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                    Subject
                                                </td>
                                                <td
                                                    style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                    ${data.subject}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                    Submitted On
                                                </td>
                                                <td style="padding:12px 15px;font-size:14px;color:#333333;">
                                                    ${data.createdAt.toLocaleString()}
                                                </td>
                                            </tr>

                                        </table>

                                        <!-- Message -->
                                        <table width="100%" cellpadding="0" cellspacing="0"
                                            style="border-collapse:collapse;margin-bottom:25px;">

                                            <tr>
                                                <td
                                                    style="background-color:#f1f5f9;padding:12px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                    Customer Message
                                                </td>
                                            </tr>

                                            <tr>
                                                <td
                                                    style="background-color:#fafafa;border:1px solid #eeeeee;padding:18px 15px;font-size:14px;line-height:25px;color:#555555;">
                                                   ${data.message}
                                                </td>
                                            </tr>

                                        </table>

                                        <!-- Action -->
                                        <div style="text-align:center;margin:30px 0;">
                                            <a href="${process.env.SITE_URL}/admin"
                                                style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:5px;font-size:14px;font-weight:bold;">
                                                View Query in Admin Panel
                                            </a>
                                        </div>

                                        <p style="margin:0;font-size:14px;line-height:24px;color:#777777;">
                                            Please make sure this query is reviewed and responded to promptly.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td
                                        style="background-color:#f8f9fa;padding:20px 30px;text-align:center;font-size:12px;line-height:20px;color:#888888;">
                                        This is an automated notification from the ${process.env.SITE_NAME} website.
                                        <br>
                                        © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
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
        let data = await ContactUs.find().sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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

async function deleteRecord(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
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
    deleteRecord
}
