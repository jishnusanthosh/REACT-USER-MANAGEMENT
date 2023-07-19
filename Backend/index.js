const express = require("express");
const cors = require("cors");
const mongoose = require("./db");
const UserRoutes = require("./Routes/UserRoutes");
const AdminRoutes=require('./Routes/AdminRoutes')

const app = express();
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/", UserRoutes);
app.use("/admin",AdminRoutes)

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
