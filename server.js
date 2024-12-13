const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

app.post("/send-notification", async (req, res) => {
    const { token, title, body, data } = req.body;

    const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: data || {},
    };

    try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        res.status(200).send(result);
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
