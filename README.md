# MoneyMinder

## Overview

MoneyMinder is a full-stack web application built using the MEAN stack, which includes MongoDB, Express, Angular, and Node.js. This application allows users to efficiently track their spending patterns, generate reports, and manage their financial accounts. With a user-friendly interface and robust backend, it provides a comprehensive solution for personal finance management.

![132344](https://github.com/user-attachments/assets/4bebd769-a7e4-4d49-bf1e-86dab91da090)

## Features

* User Authentication: Secure login and registration functionality to protect your data.
* Dashboard: A comprehensive overview of your expenses and financial health.
* Reports: Generate detailed reports to understand your spending patterns.
* Statistics: Visualize your expenses with charts and graphs for better insights.
* Accounts Management: Manage multiple accounts for different expense categories.
* User Profile: Customize your profile settings and preferences.
* Settings: Adjust application settings to suit your needs.

![132402](https://github.com/user-attachments/assets/24672671-5f08-458b-a428-82cbb31c6457)

## Safety Features
MoneyMinder App incorporates several robust security measures to protect user data and ensure safe interactions with the application:
* JWT Authentication: After logging in, every request includes a Bearer token in the headers. This token is generated using JSON Web Tokens (JWT), which provides a secure way to transmit information between parties as a JSON object. The token has a time limit of 15 minutes, ensuring that even if a token is compromised, its validity is short-lived.
* Double Layer Protection: The JWT is not only encrypted but also further secured using a crypto algorithm. This double layer of encryption adds an additional level of security, making it significantly harder for unauthorized users to access sensitive information.
* Token Storage: The MongoDB database securely stores the tokens, ensuring that they are managed properly and can be invalidated when necessary.
* ID Encryption: All IDs sent in HTTP requests or returned to the frontend are encrypted using the built-in crypto library in Node.js. This ensures that sensitive identifiers are not exposed in their raw form, adding another layer of security against potential attacks.
* Helmet.js: The application uses Helmet.js, a middleware for Express that helps secure HTTP headers. By setting various HTTP headers, Helmet protects against common vulnerabilities such as cross-site scripting (XSS) and clickjacking, enhancing the overall security of the application.
* Auth Guard and Interceptor: In the Angular frontend, an Auth Guard is implemented to protect routes from unauthorized access. Additionally, an Auth Interceptor is used to automatically attach the Bearer token to outgoing HTTP requests, ensuring that all requests are authenticated.

![132506](https://github.com/user-attachments/assets/0d785c9c-fa03-4bac-9d89-4d6e19b50bd6)

## Getting Started
Follow these steps to set up and run the Expense Tracker App on your local machine.

## Prerequisites
Make sure you have the following installed:

* Node.js (version 18 or higher)
* MongoDB (running locally or use a cloud service)
* Angular CLI (version 18 or higher)
    * install via npm with npm install -g @angular/cli

## Installation

### 1. Clone the Repository

```
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Backend Dependencies
Navigate to the backend directory and install the required packages:

```
cd backend
npm i
```

### 3. Set Up Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CRYPTO_SECRET=<your-encryption-key>
```

### 4. Install Frontend Dependencies

Navigate back to the root directory and then to the frontend directory:

```
cd ..
npm install
```

![132545](https://github.com/user-attachments/assets/227bcde5-09b1-4a6b-b34c-86b10e61accf)

## Running the Application

### 1. Start the Backend Server

From the backend directory, run:

```
npm start
```

### 2. Start the Frontend Application

From the frontend directory, run:

```
ng serve
```

### 3. Access the Application

Open your web browser and go to `http://localhost:4200` to access the Expense Tracker App.

![132557](https://github.com/user-attachments/assets/159b5091-97f5-4cc8-90d1-36dccaa53577)

## Usage

* Registration: Create an account by navigating to the registration page.
* Login: Use your credentials to log in.
* Dashboard: Once logged in, you can view your dashboard with an overview of your expenses.
* Explore Features: Navigate through reports, statistics, accounts management, profile settings, and more!

![132648](https://github.com/user-attachments/assets/231ab68e-9074-486e-b510-38e5dbab75d9)

## Technologies Used
### Frontend
* Angular 18
* Bulma CSS Framework
* ECharts for visualizations

### Backend
* Node.js
* Express.js
* MongoDB
* JWT
* Passport.js
* Morgan
