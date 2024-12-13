const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require('dotenv').config();


admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
});

const app = express();
app.use(bodyParser.json());

// Endpoint to send notifications
app.post("/send-notification", async (req, res) => {
    const { token, title, body, data } = req.body;

    const message = {
        notification: {
            title,
            body,
        },
        data: data || {},
        token: token, // Expo Push Token
    };

    try {
        const response = await admin.messaging().send(message);
        res.send({ success: true, response });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
