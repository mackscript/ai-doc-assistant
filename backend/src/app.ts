import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express()
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://ai-doc-assistant-sable.vercel.app",
        ],
        credentials: true,
    })
);


app.use(express.json())

// app.get('/', (req, res) => {
//     res.send("AI Document Assistant API is running!")
// })


app.use('/api/auth', authRouter)
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes)
app.use("/api/chat", chatRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});

export default app;