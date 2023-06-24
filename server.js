const dotenv = require("dotenv");
const express = require("express");
const { unless } = require("express-unless");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./Routes/userRoute");
const boardRoute = require("./Routes/boardRoute");
const listRoute = require("./Routes/listRoute");
const cardRoute = require("./Routes/cardRoute");

const auth = require("./Middlewares/auth");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
  auth.verifyToken.unless({
    path: [
      { url: "/user/login", method: ["POST"] },
      { url: "/user/register", method: ["POST"] },
    ],
  })
);

//MONGODB CONNECTION
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection is succesfull!");
  })
  .catch((err) => {
    console.log(`Database connection failed!`);
    console.log(`Details : ${err}`);
  });

//ROUTES
app.use("/user", userRoute);
app.use("/boards", boardRoute);
app.use("/list", listRoute);
app.use("/card", cardRoute);

const PORT = process.env.PORT || "3601";
app.listen(PORT, () => {
  console.log(`Server is online! Port: ${process.env.PORT}`);
});
