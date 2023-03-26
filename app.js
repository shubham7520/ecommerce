import express from "express";
import { config } from "dotenv";
import connectioDb from "./config/connectDb.js"
import productRoute from "./routes/productRoute.js"
import userRoute from "./routes/userRoute.js";
import cookie from "cookie-parser";
import orderRoute from "./routes/orderRoute.js"


const app = express();
config();
connectioDb();

app.use(express.json());
app.use(cookie());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Api is working.." });
})


app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server start on port ${process.env.PORT}..`)
});

// Unhandle Rejection Error then Server shutdown

// process.on('unhandledRejection', (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log("Server is shutdown....");

//     server.close(() => {
//         process.exit(1);
//     })
// })