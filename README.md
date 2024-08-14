
# EasyCart

Welcome to EasyCart, an e-commerce platform focused on men’s fashion. EasyCart provides a comprehensive shopping experience with features including Google Authentication, product reviews, and a fully-featured admin panel.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Contributing](#contributing)
8. [Links](#links)
9. [Contact](#contact)

## Overview

EasyCart is an e-commerce platform built with Node.js and Express.js for the backend, using MongoDB as the database. The frontend is rendered with EJS, following the MVC (Model-View-Controller) architecture for a clean separation of concerns.

## Features

- **User Authentication**: Secure login and registration using Google Authentication and SMTP mailing.
- **Product Listings**: Browse a range of men’s fashion items with detailed descriptions and images.
- **Product Reviews**: Users can leave reviews and ratings for products.
- **Responsive Design**: UI designed with EJS, Bootstrap, and CSS for a responsive and user-friendly experience.
- **Cart Management**: Manage items in the cart and proceed to checkout.
- **Order Management**: View order history and manage current orders.
- **Payment Gateway Integration**: Utilizes Razorpay for secure payment processing.
- **Admin Dashboard**: Comprehensive panel for user management, sales reporting, and product lifecycle management.
- **Image Storage**: Centralized image storage using Cloudinary for efficient media handling.
- **Offers**: Manage offers based on product and category to attract and retain customers.
- **Referral Programs**: Implement referral programs to incentivize users to bring new customers.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side application development.
- **Express.js**: Web framework for Node.js to manage routing and middleware.
- **MongoDB**: NoSQL database for data storage.
- **Google Authentication**: For user login and authentication.
- **EJS**: Templating engine for rendering dynamic content.
- **Bootstrap**: For responsive UI design.
- **CSS**: For additional styling and layout adjustments.
- **Razorpay**: Payment gateway integration for processing transactions.
- **Cloudinary**: Image storage and management.
- **MVC Architecture**: For a clean separation of concerns and efficient data management.

## Installation

To set up EasyCart:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/adwxithc/easy-cart.git
   cd easy-cart
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, run:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# MongoDB URI
MONGODB_URL_LOCAL='mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/?retryWrites=true&w=majority'

# Port
PORT=4000

# SMTP Configuration
SMTP_HOST='smtp.gmail.com'
SMTP_USER='your_email@gmail.com'
SMTP_PASS='your_smtp_password'

# Base URL
BASE_URL='http://localhost:4000'

# Session Secret
SESSION_SECRET='your_session_secret'

# Razorpay Configuration
RAZORPAY_KEY_ID='your_razorpay_key_id'
RAZORPAY_KEY_SECRET='your_razorpay_key_secret'

# Reset Password Secret
RESET_PASSWORD_SECRET='your_reset_password_secret'

# Node Environment
NODE_ENV='development' # Change to 'production' for live deployment

# Google OAuth Configuration
GOOGLE_CLIENT_ID='your_google_client_id'
GOOGLE_CLIENT_SECRET='your_google_client_secret'
GOOGLE_AUTH_CALLBACK_URI='http://localhost:4000/auth/google/callback'

# Cloudinary Configuration
CLOUD_NAME='your_cloudinary_cloud_name'
API_KEY='your_cloudinary_api_key'
API_SECRET='your_cloudinary_api_secret'
```

Replace the placeholder values with your actual configuration details.

## Running the Application

1. **Start the Application**

   Run the application with:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4000`.

## Contributing

We welcome contributions to EasyCart! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.


## Links

- **GitHub Repository**: [EasyCart GitHub](https://github.com/adwxithc/easy-cart)
- **Live Link**: [EasyCart Live](https://easy-cart-14ue.onrender.com/)

## Contact

For questions or feedback, please contact:

- **Adwaith C**
- **Email**: [adwaithjanardhanan0@gmail.com](mailto:adwaithjanardhanan0@gmail.com)
- **LinkedIn**: [Adwaith C LinkedIn](https://www.linkedin.com/in/adwaith-c-25b5a0218/)
- **GitHub**: [adwxithc](https://github.com/adwxithc)

