const express = require("express");
const cors = require("cors");

const utils = require("./utils");
const config = require("./config");
const jwt = require("jsonwebtoken");

const port = config.PORT_NO;

console.log(port);

// create a new express application
const app = express();
app.use(cors());
app.use(express.json());

// return version
app.get("/version", (req, res) => res.send(utils.createSuccessResponse("1.0")));

// add Routes
const userRoutes = require("./routes/user");
const staffroutes = require("./routes/staff");
const studentroutes = require("./routes/student");
const course_grouproutes = require("./routes/course_group");
const subjectsroutes = require("./routes/subjects");
const adminroutes = require("./routes/admin");
const coursesroutes = require("./routes/courses");
const cocoroutes = require("./routes/coco");

app.use("/user", userRoutes);
app.use("/staff", staffroutes);
app.use("/student",studentroutes);
app.use("/course_group",course_grouproutes);
app.use("/subjects",subjectsroutes);
app.use("/admin",adminroutes);
app.use("/courses", coursesroutes);
app.use("/coco",cocoroutes);


app.listen(port, () => console.log(`App listening on port ${port}!`));
