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
  

  const { staff_id, employee_number, staff_name, email, password,role,course_name } = request.body;

  console.log(request.body);

  // create a sql statement
  const statement = 'INSERT INTO staff (staff_id, employee_number,staff_name,email, password,role,course_name) VALUES (?, ?, ?,? ,? ,? ,?)';

  // encrypt the password
  const encryptedPassword = String(crypto.SHA256(password));

  db.execute(statement, [staff_id,employee_number, staff_name, email, encryptedPassword,role,course_name], (error, result) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      response.send(
        utils.createSuccessResponse("Staff registered successfully")
      );
    }
  });
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;
console.log(email,password);
  // First query to check if the email exists
  const emailCheckStatement = 'SELECT staff_id, staff_name, email FROM staff WHERE email = ?';

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
        const passwordCheckStatement = 'SELECT staff_id, staff_name, email, role FROM staff WHERE email = ? AND password = ?';

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
                const staff = users[0];

                // Creating a payload with user information for JWT token
                const payload = {
                  user_id: staff.staff_id,
                  user_name: staff.staff_name,
                  user_email: staff.email,
                  role: staff.role
                };

                // Generating a JWT token with the payload and a secret key
                const token = jwt.sign(payload, config.SECRET_KEY);

                console.log("====================================");
                console.log("token-", token);
                console.log("====================================");

                response.send(
                  utils.createSuccessResponse({
                    token,
                    user_name: staff.staff_name,
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
router.get("/staff", (req, res) => {
  // Query to fetch list of staff from database
  console.log("staff");
  const query = "SELECT * FROM staff";

  db.execute(query, (error, staff) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse(staff));
    }
  });
});

// Create a new staff
router.post("/staff", (req, res) => {
  const { name, email } = req.body;

  console.log("body- ", req.body);

  const query = "INSERT INTO staff(staff_name, email) VALUES (?, ?)";
  db.execute(query, [name, email], (error, results) => {
    if (error) {
      console.error("Database error: ", error);
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(
        utils.createSuccessResponse({ id: results.insertstaff_id, staff_name, email })
      );
    }
  });
});

// Update a staff
router.put("/staff/:id",  (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query = "UPDATE staff SET staff_name = ?, email = ? WHERE staff_id = ?";
  db.execute(query, [name, email, id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ staff_id, staff_name, email }));
    }
  });
});

// Delete a student
router.delete("/staff/:id",  (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM staff WHERE staff_id = ?";
  db.execute(query, [id], (error, results) => {
    if (error) {
      res.status(500).json(utils.createErrorResponse("Database error"));
    } else {
      res.json(utils.createSuccessResponse({ id }));
    }
  });
});
module.exports = router;