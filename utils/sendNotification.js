const admin = require("../firebaseAdmin");

const sendNotification = async (tokens, title, body) => {
  try {
    console.log("📤 Sending notification to:", tokens); // DEBUG

    if (!tokens || tokens.length === 0) {
      console.log("❌ No tokens found");
      return;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("✅ Notification sent:", response);

  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};

module.exports = sendNotification;