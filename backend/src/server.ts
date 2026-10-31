import "dotenv/config";
import app from "./app.js";

import connectDB from "./config/db.js";

const PORT = Number(process.env.PORT) || 5125;

connectDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Server startup failed:", error);
        process.exit(1);
    });