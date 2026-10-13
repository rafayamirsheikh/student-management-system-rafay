Student Management System

A full-stack Student Management System built using the MERN stack.

Technologies Used

* React.js — Frontend
* Node.js — Runtime
* Express.js — Backend API
* MongoDB — Database
* Mongoose — Database integration
* CSS — Responsive user interface

Features

* Add new student records
* View students in a table
* Edit existing student details
* Delete student records
* Store student data in MongoDB
* Fetch saved records after page refresh
* Form validation for required fields

Student Information

* Student Name
* Email Address
* Father’s Name
* Course Name
* Fee Structure
* Subjects
* Class Timing

Run Locally

1. Start the backend

Open a terminal in the backend folder and run:

npm install
npm start

Ensure your local MongoDB server is running.

2. Start the frontend

Open a second terminal in the frontend folder and run:

npm install
npm run dev

Open the local URL displayed by Vite in your browser.

Database

The application uses the local MongoDB database named student_management.

Security

Keep .env private. Do not commit environment files or node_modules to version control.

Project Purpose

This project demonstrates full-stack CRUD operations and database integration for student record management.