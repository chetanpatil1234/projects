const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("../verifyToken");

// REGISTER subjects
router.post("/", (request, response) => {
  const { subject_name, course_name } = request.body;

  // find course_id
  const courseStatement = "select course_id from courses where course_name = ?";

  // encrypt the password
  //const encryptedPassword = String(crypto.SHA256(password));

  db.execute(courseStatement, [course_name], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (result.length === 0) {
        response.send(utils.createErrorResponse("Invalid course name!"));
      } else {
        var { course_id } = result[0];
        console.log("cid", course_id);

        // create a sql statement
        const statement =
          "INSERT INTO subjects (subject_name,course_id) VALUES (?, ?)";

        // encrypt the password
        //const encryptedPassword = String(crypto.SHA256(password));

        db.execute(statement, [subject_name, course_id], (error, result) => {
          if (error) {
            response.send(utils.createErrorResponse(error));
          } else {
            response.send(
              utils.createSuccessResponse("Subject Added successfully")
            );
          }
        });
      }
    }
  });
});

// Protected route example
router.get("/subjects", (req, res) => {
  // Query to fetch list of students from database
  console.log("subjects");
  const query = "SELECT * FROM subjects";

  db.execute(query, (error, courses) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(courses));
    }
  });
});

router.get("/subjects/:course_name", (req, res) => {

  const course_name = req.params.course_name;
  // Query to fetch list of students from database
  console.log("subjects");

  const coursequery = "SELECT course_id FROM courses where course_name = ?";

  db.execute(coursequery,[course_name], (error, courses) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      const {course_id} = courses[0]
      console.log("course_id", course_id);

      const query = "SELECT * FROM subjects where course_id = ?";

      db.execute(query,[course_id], (error, courses) => {
        if (error) {
          res.status(500).json(utils.createErrorResponse("Database error"));
        } else {
          res.json(utils.createSuccessResponse(courses));
        }
      });
    }
  });
 
});

module.exports = router;
