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

## Getting Started: Dockerized Development Environment

This project is fully containerized using Docker Compose, allowing for a complete, self-contained development environment to launch in a single command, including a local MongoDB instance.

### Prerequisites

- **Docker Desktop:** Must be installed and running (includes Docker and Docker Compose)
- **Git**

### Installation and Launch

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Configure secrets**
    The application requires security tokens (JWT secrets). The development configuration uses a local MongoDB container, meaning you do not need to provide a public cloud URI.

    - Create your secrets file by copying the example:

        ```bash
        cp .env.example .env
        ```

    - Edit the newly created .env file and replace the two placeholder values with long, random strings (e.g., use an online GUID generator):

        - ACCESS_TOKEN_SECRET
        - REFRESH_TOKEN_SECRET

3. **Launch the Development Environment**

    Run the following single command from the project root. This command builds the optimized images, starts the database, and launches both hot-reloading servers.

    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```

4. **Access the Application**

    Once the logs settle (indicating the React Dev Server is ready), open your browser:

    **Application URL:** `http://localhost:3000`

## Usage

1. Navigate to `http://localhost:3000` in your browser.  
2. Sign up or log in to access the dashboard.  
3. Create transactions, budgets, and goals.  
4. Filter, sort, and edit entries directly from the dashboard.  
5. Log out securely using the top-right button.

## Behind the Scenes (For Technical Reviewers)

This setup demonstrates:

- **Multi-Stage Builds:** Separate builder stages for both server and client to minimize production image size.

- **Service Discovery:** The backend automatically connects to the mongo service using the mongodb://mongo:27017 internal URI, bypassing public DNS.

- **Local Persistence:** The database uses a named volume (mongo-data) to persist development data locally.

- **Hot-Reloading:** Source code volumes (.:/usr/src/app) are mapped to enable instant code changes on save.

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
