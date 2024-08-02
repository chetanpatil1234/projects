const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const verifyToken = require("../verifyToken");

router.get("/", (req, res) => {
    // Query to fetch list of students from database
   
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
router.post("/", (req, res) => {
    const { course_name, description } = req.body;
  
    console.log("body- ", req.body);
  
    const query = "INSERT INTO courses (course_name, description) VALUES (?, ? )";
    db.execute(query, [course_name, description ], (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        res.status(500).json(utils.createErrorResponse("Database error", error.message));
      } else {
        res.json(
          utils.createSuccessResponse("Course added successfully")
        );
      }
    });
  });
  
  // Update a course
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { subject_id,subject_name,course_id} = req.body;
  
    const query = "UPDATE courses SET course_name = ?, description = ? WHERE course_id = ?";
    db.execute(query, [subject_id,subject_name,course_id], (error, results) => {
      if (error) {
        res.status(500).json(utils.createErrorResponse("Database error"));
      } else {
        res.json(utils.createSuccessResponse({ course_id, course_name, description }));
      }
    });
  });
  
  // Delete a course
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM courses WHERE course_id = ?";
    db.execute(query, [id], (error, results) => {
      if (error) {
        res.status(500).json(utils.createErrorResponse("Database error"));
      } else {
        res.json(utils.createSuccessResponse("Course deleted successfully"));
      }
    });
  });

  module.exports = router;