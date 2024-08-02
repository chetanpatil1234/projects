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

  db.execute(statement, [course_id,course_name, description], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("course added  successfully")
      );
    }
  });
});
// REGISTER subjects
router.post("/subjects", (request, response) => {
  console.log("====================================");
  console.log(request);
  console.log("====================================");

  const { subject_name } = request.body;

  // create a sql statement
  const statement = 'INSERT INTO subjects (subject_name) VALUES (?)';

  // encrypt the password
  //const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [subject_name], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("User registered successfully")
      );
    }
  });
});

 /*router.post("/subject", (request, response) => {
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
// Protected route example
router.get("/subjects", (req, res) => {
  // Query to fetch list of students from database
  console.log("subjects");
  const query = "SELECT * FROM subjects";

  db.execute(query, (error, subjects) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(courses));
    }
  });
});

// Create a new course
router.post("/courses", verifyToken, (req, res) => {
  const { course_id,course_name, description } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO courses (course_id,course_name, description) VALUES (?, ? ,?)";
  db.execute(query, [course_id,course_name,description ], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ id: results.insertcourse_id, course_name, description })
      );
    }
  });
});
// Create a new subject
router.post("/subjects", verifyToken, (req, res) => {
  const { subject_name } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO subjects (subject_name ) VALUES (?)";
  db.execute(query, [subject_name ], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ id: results.insertsubject_id, course_name, course_id })
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
      res.json(utils.createSuccessResponse({ subject_id, subject_name, course_id }));
    }
  });
});

// Update a subject
router.put("/subjects/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { subject_name } = req.body;

  const query = "UPDATE subjects SET subject_name = ? WHERE subject_id = ?";
  db.execute(query, [subject_name, subject_id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ subject_id, subject_name, course_id }));
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
// Delete a course
router.delete("/subjects/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM subjects WHERE subject_id = ?";
  db.execute(query, [subject_id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ subject_id }));
    }
  });
});
module.exports = router;