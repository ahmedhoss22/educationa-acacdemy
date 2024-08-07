const { sendContactEmail } = require("../services/nodemailer.service");

exports.contactUsCtrl = async (req, res) => {
  try {
    const { firstName, lastName, email: userEmail, phone, message } = req.body;
    console.log(req.body);

    if (!firstName || !lastName || !userEmail || !message || !phone) {
      return res.status(400).json({ message: "all fields required" });
    }
    await sendContactEmail(firstName, lastName, userEmail, phone, message);
    res.status(200).json({ message: "your Feedback successfully sent" });
  } catch (error) {
    res.status(404).json({ message: "failed to send", error: error.message });
  }
};