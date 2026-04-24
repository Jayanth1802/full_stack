const express = require("express");
const cors = require("cors");

const { processData } = require("./utils/graph");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bfhl", (req, res) => {
    const { data } = req.body;

    const result = processData(data);

    res.json({
        user_id: "yourname_ddmmyyyy",
        email_id: "your_email",
        college_roll_number: "your_roll",
        ...result
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));