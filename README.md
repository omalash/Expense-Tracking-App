# Expense Tracking Web Application

## Overview

The Expense Tracking Web Application is a full-stack financial management tool designed to help users track expenses, manage budgets, set financial goals, and gain actionable insights. Built with a Node.js/Express backend, MongoDB database, and a React frontend, it provides a seamless and secure user experience.

## Key Features

- **User Authentication & Security**  
  - Register with email verification  
  - Secure login and JWT-based access & refresh tokens  
  - Protected routes for transactions and budgets

- **Transactions Management**  
  - Add, view, edit, and delete income and expense entries  
  - Filter by type (Income/Expense) and sort by date, amount, category, or type  
  - Inline edit via modal dialogs  
  - Real-time dashboard updates

- **Budgets & Goals**  
  - Create recurring budgets
  - Track spending against budget limits  
  - Visual status indicators (On Track / Over Budget)  

- **Dashboard Insights**  
  - Summarized totals: Total Income, Total Expenses, Net Total  
  - Responsive, widget-based layout  
  - Sortable and filterable tables  

- **Guest Mode (Coming Soon)**  
  - Add transactions and budgets locally without an account  
  - Full feature preview before sign-up

## Tech Stack

- **Backend:** Node.js, Express.js, Mongoose (MongoDB)  
- **Frontend:** React, React Router, React Bootstrap, FontAwesome  
- **Authentication:** JSON Web Tokens (JWT) with access & refresh tokens  
- **Styling:** Bootstrap 5  

## Getting Started

### Prerequisites

- Node.js (v14+) & npm  
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env to add your secrets:
   # MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Edit .env:
   # REACT_APP_BACKEND_ROUTE=http://localhost:3500
   npm start                     # Starts React on http://localhost:3000
   ```

## Environment Variables

- **Backend (`.env`):**

  ```env
  PORT=3500
  MONGODB_URI=<your_mongo_uri>
  ACCESS_TOKEN_SECRET=<random_secret>
  REFRESH_TOKEN_SECRET=<random_secret>
  ```

- **Frontend (`/client/.env`):**

  ```env
  REACT_APP_BACKEND_ROUTE=http://localhost:3500
  ```

## Usage

1. Navigate to `http://localhost:3000` in your browser.  
2. Sign up or log in to access the dashboard.  
3. Create transactions, budgets, and goals.  
4. Filter, sort, and edit entries directly from the dashboard.  
5. Log out securely using the top-right button.

## Future Enhancements

- Export data to CSV/PDF  
- Charts and visual analytics  
- Mobile-responsive refinements  
- Guest mode local storage syncing  

## Contributing

Contributions are welcome! Please:

1. Fork the repo  
2. Create a feature branch  
3. Submit a pull request

## Contact

**Omar Malash**  
Email: <omalash004@gmail.com>  
LinkedIn: <https://www.linkedin.com/in/omar-malash/>
