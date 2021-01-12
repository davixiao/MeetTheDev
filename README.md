# MeetTheDev
Heroku - https://meet-the-dev.herokuapp.com/

### Introduction
Ever wanted a place to connect with like-minded developers? MeetTheDev is a social network built for developers. 

### Technology Stack

Developed using the MERN stack.

The frontend was built with React.js and used Redux for state management. While the backend was created with Node.js, Express.js, and used MongoDB Atlas to store user information.

### How it works
This fullstack application features:
- User Authentication with Register and Login System
- Functioning Dashboard for Registered Users
- User Posts with Upvotes and Comments
- User Profiles with Github Repositories using GitHub API

Users first register their accounts by providing certain information. Then, a POST request is made to the backend API to add the user to the database. The passwords are encryped using bcrypt.js and the server provides a JWT Authentication token to certify that the user is logged in. The user then gains access to private routes in the frontend, such as the dashboard and posts. The application uses gravatar to provide an avatar for the user profile, and allows users to edit their profile fields. 
