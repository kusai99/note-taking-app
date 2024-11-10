# Note Taking App

## Overview

A RESTful Note Taking application built with ExpressJS, Sequelize, MySQL, and Redis, containerized using Docker for efficient deployment and management. This application supports secure user registration, authentication, and CRUD and advanced search operations on notes, along with optimized note retrieval using Redis caching.

## Features

- User Registration: Sign up new users with username and password.
- User Authentication: User login with token-based authentication.
- CRUD Operations for Notes: Create, simple read, advanced search, update, and delete notes associated with users.
- Redis Caching: Improves performance by caching frequently accessed notes.
- Design Patterns: Implements Singleton for logs and Redis instance and Factory pattern for note creation.
- Dockerized Environment: Easily deployable using Docker and Docker Compose.
- Detailed logging of errors and user operations. The logger util service creates and manages log files inside the logs folder in the root directory.

## Requirements

- Node.js:18.
- Docker:27.3.1
- Postman or cURL for testing the endpoints

## Getting Started 
-  Clone the Repository and navigate to the project directory

- Create a .env file in the root directory with the following environment variables:
  
    >DB_HOST=db
    DB_USER=root
  >
    >DB_PASSWORD=your_mysql_password
  >
   >DB_NAME=note_app
  >
   >DB_PORT=3306
  >
   >JWT_SECRET=your_jwt_secret
  >
   >REDIS_HOST=redis
  >
   >REDIS_PORT=6379

-  Make sure the values inside docker-compose.yml are set to the correct env variables inside .env
-  Build and run the Docker container using docker-compose
  ```bash
  docker-compose up --build
 ```

 This command builds and runs all necessary services, including:
 - MySQL for data storage and management.
 - Redis for caching.
 - The ExpressJS application. 

## API Documentation

###  User Endpoints
-  Register: POST: http://localhost:4000/api/auth/register
  
    Registers a new user.
-  Login: POST: http://localhost:4000/api/auth/login
  
    Authenticates a user and returns an authentication token.

###  Notes Endpoints
-  Create Note:
-  POST: http://localhost:4000/api/notes

    Creates a new note

-  Get All Notes: GET: http://localhost:4000/api/notes/

    Gets all the notes associated with the authenticated user.
  
-  Get Specific Note: GET: http://localhost:4000/api/notes/:id

    Gets a specific note for an authenticaetd user.
  
-  Search notes with criteria: POST: http://localhost:4000/api/notes/search

    Gets a list of notes for the authenticated user based on search criteria.

-  Update Note: PUT http://localhost:4000/api/notes/:id

    Updates a note by ID for the authenticated user.

-  Delete Note: DELETE http://localhost:4000/api/notes/:id

    Deletes a note by ID for the authenticated user.
##  Database Design

The application uses the following schema:

-  Users  Table

      -  Stores user credentials and metadata.


-  Notes Table

      - Stores user credentials and metadata.
 
## Caching with Redis

Redis is used to cache frequently accessed notes, improving performance for repeat requests. The caching mechanism is implemented on the Get All Notes endpoint to reduce load on the database.

##  Design Patterns

-  Singleton Pattern: Ensures a single instance of the logger and Redis classes are used throughout the application.
-  Factory Method Pattern: Used to create instances of different types of notes (e.g., personal, work). the NoteType enum is extendable.

##  Testing the Application

You can test the application using Postman or curl commands. Make sure to include the JWT token in the Authorization header for authenticated routes.

```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username": "user1", "password": "@User111", "email" : "user1Email@email.com}'
```
