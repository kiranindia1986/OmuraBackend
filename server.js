const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";

let pushTokens = []; // Array to store Expo push tokens

// Endpoint to store push tokens
app.post("/register", (req, res) => {
    const { token } = req.body;
    if (!token || !/^ExpoPushToken\[.*\]$/.test(token)) {
        return res.status(400).send({ success: false, error: "Invalid Expo push token." });
    }
    if (!pushTokens.includes(token)) {
        pushTokens.push(token);
    }
    res.send({ success: true });
});

// Endpoint to send notifications
app.post("/send-notification", async (req, res) => {
    const { title, body, data } = req.body;

    if (!title || !body) {
        return res.status(400).send({ success: false, error: "Title and body are required." });
    }

    if (pushTokens.length === 0) {
        return res.status(400).send({ success: false, error: "No push tokens registered." });
    }

    const messages = pushTokens.map((token) => ({
        to: token,
        sound: "default",
        title,
        body,
        data,
    }));

    try {
        const response = await axios.post(EXPO_PUSH_API_URL, messages, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        res.send({ success: true, data: response.data });
    } catch (error) {
        console.error("Error sending notification:", error.response?.data || error.message);
        res.status(500).send({ success: false, error: error.response?.data || error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
