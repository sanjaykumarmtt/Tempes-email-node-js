import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/UserRouter.js"
import cors from "cors";

const app = express();

app.use(cors());

app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen();
// function states_server() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
//     .catch((error) => console.log(error));
// }

// states_server();
app.use("/api/user", route);


