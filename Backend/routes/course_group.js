const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("../verifyToken");

// REGISTER course group
router.post("/course_group", (request, response) => {
  console.log("====================================");
  console.log(request);
  console.log("====================================");

  const { course_id,course_name, description } = request.body;

  // create a sql statement
  const statement = 'INSERT INTO courses (course_id,course_name,description) VALUES (?, ?, ?)';

  // encrypt the password
  //const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [ course_id,course_name, description], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("Course added successfully")
      );
    }
  });
});

/*router.post("/login", (request, response) => {
  const { email, password } = request.body;

  // First query to check if the email exists
  const emailCheckStatement = SELECT id, name, email FROM users WHERE email = ?;

  db.execute(emailCheckStatement, [email], (error, users) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (users.length === 0) {
        response.send(utils.createErrorResponse("Invalid email!"));
      } else {
        const user = users[0];

        // Encrypt the provided password
        const encryptedPassword = String(crypto.SHA256(password));

        // Second query to check if the password matches
        const passwordCheckStatement = SELECT id, name, email FROM users WHERE email = ? AND password = ?;

        db.execute(
          passwordCheckStatement,
          [email, encryptedPassword],
          (error, users) => {
            if (error) {
              response.send(utils.createErrorResponse(error));
            } else {
              if (users.length === 0) {
                response.send(utils.createErrorResponse("Invalid password!"));
              } else {
                const user = users[0];

                // Creating a payload with user information for JWT token
                const payload = {
                  user_id: user.id,
                  user_name: user.name,
                  user_email: user.email,
                };

                // Generating a JWT token with the payload and a secret key
                const token = jwt.sign(payload, config.SECRET_KEY);

                console.log("====================================");
                console.log("token-", token);
                console.log("====================================");

                response.send(
                  utils.createSuccessResponse({
                    token,
                    user_name: user.name,
                  })
                );
              }
            }
          }
        );
      }
    }
  });
});*/

// Protected route example
router.get("/courses", (req, res) => {
  // Query to fetch list of students from database
  console.log("courses");
  const query = "SELECT * FROM courses";

  db.execute(query, (error, courses) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(courses));
    }
  });
});

// Create a new course
router.post("/courses", (req, res) => {
  const { course_name, description } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO courses (course_name, description) VALUES (?, ?)";
  db.execute(query, [course_name, description ], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ course_name, description })
      );
    }
  });
});

// Update a course
router.put("/courses/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { course_name, description } = req.body;

  const query = "UPDATE courses SET course_name = ?, description = ? WHERE course_id = ?";
  db.execute(query, [course_name, description, course_id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ course_id, course_name, description }));
    }
  });
});

// Delete a course
router.delete("/courses/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM courses WHERE course_id = ?";
  db.execute(query, [course_id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ course_id }));
    }
  });
});
module.exports = router;