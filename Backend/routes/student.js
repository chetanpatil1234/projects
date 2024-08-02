const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("../verifyToken");

// REGISTER API
router.post("/register", (request, response) => {
  

  const { student_name, roll_no, email, password } = request.body;

  // create a sql statement
  const statement = 'INSERT INTO students (student_name, roll_number, email, password) VALUES (?, ?, ?,?)';

  // encrypt the password
  const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [student_name, roll_no, email, encryptedPassword], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("Student registered successfully")
      );
    }
  });
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;
console.log(email,password);
  // First query to check if the email exists
  const emailCheckStatement = 'SELECT student_id, student_name, email FROM students WHERE email = ?';

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
        const passwordCheckStatement = 'SELECT student_id, student_name, email, role FROM students WHERE email = ? AND password = ?';

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
                const student = users[0];

                // Creating a payload with user information for JWT token
                const payload = {
                  user_id: student.student_id,
                  user_name: student.student_name,
                  user_email: student.email,
                  role: student.role
                };

                // Generating a JWT token with the payload and a secret key
                const token = jwt.sign(payload, config.SECRET_KEY);

                console.log("====================================");
                console.log("token-", token);
                console.log("====================================");

                response.send(
                  utils.createSuccessResponse({
                    token,
                    user_name: student.student_name,
                  })
                );
              }
            }
          }
        );
      }
    }
  });
});

// Protected route example
router.get("/students", (req, res) => {
  // Query to fetch list of students from database
  console.log("students");
  const query = "SELECT * FROM students";

  db.execute(query, (error, students) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(students));
    }
  });
});

// Create a new student
router.post("/students", verifyToken, (req, res) => {
  const { name, email } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO students (student_name, email) VALUES (?, ?)";
  db.execute(query, [name, email], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ id: results.insertstudent_id, student_name, email })
      );
    }
  });
});

// Update a student
router.put("/students/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = "UPDATE students SET student_name = ?, email = ? WHERE student_id = ?";
  db.execute(query, [name, email, id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ student_id, student_name, email }));
    }
  });
});

// Delete a student
router.delete("/students/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM students WHERE student_id = ?";
  db.execute(query, [id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ id }));
    }
  });
});
module.exports = router;