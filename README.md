# Expense Tracking Web Application

## Overview

The Expense Tracking Web Application is a secure and efficient financial management tool built using Node.js, Express.js, and MongoDB. It enables users to keep track of their expenses, manage budgets, and gain insights into their financial activities. This repository contains the backend implementation of the application, providing RESTful API endpoints for seamless communication with the future React frontend.

## Features

- User registration and login with email verification
- User authentication and authorization using JSON Web Tokens (JWT)
- Utilize MongoDB to store and manage user data, financial transactions, and budget plans efficiently
- Create RESTful API endpoints to perform CRUD (Create, Read, Update, Delete) operations on transactions and budgets

## Installation and Setup

1. Clone the repository to your local machine.
2. Install Node.js and npm if you haven't already.
3. Install project dependencies by running the following command: `npm install`
4. Create a .env file in the root directory and add the following environment variables:
   
    ```
    PORT=9000
    MONGODB_URI=YOUR_MONGODB_URI
    ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
    REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
    ```

    Replace
    YOUR_MONGODB_URI, YOUR_ACCESS_TOKEN_SECRET, and YOUR_REFRESH_TOKEN_SECRET
    with your MongoDB connection URI, access token secret, and refresh token secret, respectively

6. Run the application using the following command: `npm start`
7. Access the application by navigating to http://localhost:9000 in your web browser.

## Usage

1. Register as a new user or log in if you already have an account.
2. Add your financial transactions and manage your budgets using the intuitive interface.
3. Gain valuable insights into your spending habits and financial activities.
4. Enjoy a secure and efficient financial management experience!

## Technologies Used

- Node.js
- Express.js
- MongoDB

## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## Contact

For any inquiries or collaboration opportunities, feel free to reach out to me:

- Name: Omar Malash
- Email: omalash004@gmail.com
- LinkedIn: https://www.linkedin.com/in/omar-malash/

