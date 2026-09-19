const User = require("../models/user.model")
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const mailer = require("../helper/mailer.helper")

// Add properties to it
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123', 'Admin@123', 'User@123', 'Password@123']);


async function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body?.password, 12, async (error, hash) => {
            if (error) {
                res.status(400).send({
                    result: "Fail",
                    reason: "Internal Server Error"
                })
            }
            else {
                try {
                    let data = new User(req.body)
                    data.password = hash
                    await data.save()
                    res.send({
                        result: "Done",
                        data: data
                    })

                    mailer.sendMail({
                        from: process.env.MAIL_USERNAME,
                        to: data.email,
                        subject: `Your Account Has Been Created : Team ${process.env.SITE_NAME}`,
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
                                                    Welcome to Your Online Shopping Destination
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Content -->
                                        <tr>
                                            <td style="padding:40px;">

                                                <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                    Welcome, ${data.name}! 🎉
                                                </h2>

                                                <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                    Thank you for creating your account with <strong>${process.env.SITE_NAME}</strong>. Your registration has been successfully completed, and your account is now ready to use.
                                                </p>

                                                <p style="margin:0 0 25px;font-size:16px;line-height:28px;color:#555555;">
                                                    You can now explore our products, add your favorite items to your wishlist, place orders, and enjoy a convenient online shopping experience.
                                                </p>

                                                <!-- Account Details -->
                                                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                    <tr>
                                                        <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                            Account Information
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="width:35%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                            Name
                                                        </td>

                                                        <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                            ${data.name}
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                            Email
                                                        </td>

                                                        <td style="padding:12px 15px;font-size:14px;color:#333333;">
                                                            ${data.email}
                                                        </td>
                                                    </tr>

                                                </table>

                                                <!-- CTA -->
                                                <div style="text-align:center;margin:35px 0;">

                                                    <a href="${process.env.SITE_URL}" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                        Start Shopping
                                                    </a>

                                                </div>

                                                <p style="margin:0 0 15px;font-size:15px;line-height:26px;color:#555555;">
                                                    If you did not create this account, please contact our customer support team immediately.
                                                </p>

                                                <p style="margin:25px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                    We're excited to have you with us!
                                                    <br><br>
                                                    <strong>Best Regards,</strong><br>
                                                    ${process.env.SITE_NAME} Customer Support Team
                                                </p>

                                            </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                            <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                                You are receiving this email because an account was created using this email address.

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
                    let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User With This ${key} is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
                    res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
                        result: 'Fail',
                        reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
                    })
                }
            }
        })
    }
    else {
        res.status(400).send({
            result: "Fail",
            reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
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
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.address = req.body.address ?? data.address
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
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
        let errorMessage = error.keyValue ? Object.fromEntries(Object.keys(error.keyValue).map(key => [key, `User With This ${key} is Already Exist`])) : Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(Object.values(errorMessage).length !== 0 ? 400 : 500).send({
            result: 'Fail',
            reason: Object.values(errorMessage).length !== 0 ? errorMessage : "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
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


async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let token = jwt.sign({ data }, process.env.JWT_SECRET_KEY, { expiresIn: "15 days" })
                res.send({
                    result: "Done",
                    data: data,
                    token: token
                })
            }
            else {
                res.status(401).send({
                    result: "Fail",
                    reason: "Invalid Username or Password"
                })
            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Math.random().toString().slice(2, 8).toString().padEnd(6, "1"))
            data.passwordResetOptions = {
                otp: otp,
                date: new Date()
            }
            await data.save()
            res.send({
                result: "Done",
                message: "OTP Has Been Sent On Your Registered Email Address"
            })
            mailer.sendMail({
                from: process.env.MAIL_USERNAME,
                to: data.email,
                subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
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
                                                    Password Reset Request
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Content -->
                                        <tr>
                                            <td style="padding:40px;">

                                                <h2 style="margin:0 0 20px;color:#222222;font-size:24px;">
                                                    Hello ${data.name},
                                                </h2>

                                                <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                    We received a request to reset the password for your <strong>${process.env.SITE_NAME}</strong> account. Use the One-Time Password (OTP) below to verify your identity and continue with the password reset process.
                                                </p>

                                                <!-- OTP Box -->
                                                <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                                                    <tr>
                                                        <td align="center" style="background-color:#f1f5f9;border:1px solid #dbe2ea;border-radius:6px;padding:25px;">

                                                            <p style="margin:0 0 10px;font-size:13px;color:#777777;text-transform:uppercase;letter-spacing:1px;">
                                                                Your Verification Code
                                                            </p>

                                                            <p style="margin:0;color:#0d6efd;font-size:36px;font-weight:bold;letter-spacing:8px;">
                                                                ${otp}
                                                            </p>

                                                        </td>
                                                    </tr>
                                                </table>

                                                <!-- Expiry Notice -->
                                                <div style="background-color:#fff8e1;border-left:4px solid #ffc107;padding:15px 18px;margin:25px 0;">
                                                    <p style="margin:0;font-size:14px;line-height:23px;color:#665c3b;">
                                                        <strong>Important:</strong> This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
                                                    </p>
                                                </div>

                                                <p style="margin:20px 0;font-size:15px;line-height:26px;color:#555555;">
                                                    If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.
                                                </p>

                                                <p style="margin:25px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                    For your security, ${process.env.SITE_NAME} representatives will never ask you to share your OTP or password.
                                                </p>

                                                <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                    <strong>Best Regards,</strong><br>
                                                    ${process.env.SITE_NAME} Customer Support Team
                                                </p>

                                            </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                            <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                                This is an automated security email from ${process.env.SITE_NAME}.

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
            res.status(401).send({
                result: "Fail",
                reason: "No User Record Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (data.passwordResetOptions.otp == req.body.otp) {
                if ((Date.now() - data.passwordResetOptions.date) > 600000) {
                    res.status(400).send({
                        result: "Fail",
                        reason: "OTP Has Been Expired, Please try Again"
                    })
                }
                else {
                    res.send({
                        result: "Done",
                    })
                }
            }
            else {
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Unauthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body?.password, 12, async (error, hash) => {
                    if (error) {
                        res.status(400).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done",
                            data: data
                        })

                        mailer.sendMail({
                            from: process.env.MAIL_USERNAME,
                            to: data.email,
                            subject: `Password Has Been Reset Successfully: Team ${process.env.SITE_NAME}`,
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
                                                            Password Reset Confirmation
                                                        </p>
                                                    </td>
                                                </tr>

                                                <!-- Content -->
                                                <tr>
                                                    <td style="padding:40px;">

                                                        <!-- Success Icon -->
                                                        <div style="text-align:center;margin-bottom:25px;">
                                                            <div style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:50%;background-color:#d1e7dd;color:#198754;font-size:32px;font-weight:bold;">
                                                                ✓
                                                            </div>
                                                        </div>

                                                        <h2 style="margin:0 0 20px;text-align:center;color:#222222;font-size:24px;">
                                                            Password Reset Successfully!
                                                        </h2>

                                                        <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                            Hello <strong>${data.name}</strong>,
                                                        </p>

                                                        <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:#555555;">
                                                            Your <strong>${process.env.SITE_NAME}</strong> account password has been successfully reset. You can now sign in to your account using your new password.
                                                        </p>

                                                        <!-- Account Details -->
                                                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:25px 0;">

                                                            <tr>
                                                                <td colspan="2" style="background-color:#f1f5f9;padding:13px 15px;font-size:16px;font-weight:bold;color:#222222;">
                                                                    Account Information
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td style="width:35%;padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;font-weight:bold;color:#555555;">
                                                                    Name
                                                                </td>

                                                                <td style="padding:12px 15px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">
                                                                    ${data.name}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td style="padding:12px 15px;font-size:14px;font-weight:bold;color:#555555;">
                                                                    Email
                                                                </td>

                                                                <td style="padding:12px 15px;font-size:14px;color:#333333;">
                                                                    ${data.email}
                                                                </td>
                                                            </tr>

                                                        </table>

                                                        <!-- Security Notice -->
                                                        <div style="background-color:#fff8e1;border-left:4px solid #ffc107;padding:16px 18px;margin:25px 0;">
                                                            <p style="margin:0;font-size:14px;line-height:23px;color:#665c3b;">
                                                                <strong>Security Notice:</strong> If you did not make this change, please contact our customer support team immediately to protect your account.
                                                            </p>
                                                        </div>

                                                        <!-- Login Button -->
                                                        <div style="text-align:center;margin:35px 0;">

                                                            <a href="${process.env.SITE_URL}/login" style="display:inline-block;background-color:#0d6efd;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:5px;font-size:16px;font-weight:bold;">
                                                                Login to Your Account
                                                            </a>

                                                        </div>

                                                        <p style="margin:0;font-size:15px;line-height:26px;color:#555555;">
                                                            For your security, never share your password with anyone. We recommend using a strong and unique password for your ${process.env.SITE_NAME} account.
                                                        </p>

                                                        <p style="margin:30px 0 0;font-size:15px;line-height:26px;color:#555555;">
                                                            <strong>Best Regards,</strong><br>
                                                            ${process.env.SITE_NAME} Customer Support Team
                                                        </p>

                                                    </td>
                                                </tr>

                                                <!-- Footer -->
                                                <tr>
                                                    <td style="background-color:#f8f9fa;padding:25px 30px;text-align:center;font-size:12px;line-height:21px;color:#888888;">

                                                        This is an automated security notification from ${process.env.SITE_NAME}.

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
                })
            }
            else {
                res.status(400).send({
                    result: "Fail",
                    reason: schema.validate(req.body?.password, { details: true }).map(x => x.message.replaceAll("string", "Password")).join("|")
                })
            }
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Unauthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
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
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3
}