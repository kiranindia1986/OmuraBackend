const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";

let pushTokens = []; // Array to store Expo push tokens

// Root route for testing
app.get("/", (req, res) => {
    res.send("Backend is running! Use specific routes for functionality.");
});

// Endpoint to store push tokens
app.post("/register", (req, res) => {
    const { token } = req.body;
    if (!pushTokens.includes(token)) {
        pushTokens.push(token);
    }
    res.send({ success: true });
});

// Endpoint to send notifications
app.post("/send-notification", async (req, res) => {
    const { title, body, data } = req.body;

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
        console.error("Error sending notification:", error);
        res.status(500).send({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
