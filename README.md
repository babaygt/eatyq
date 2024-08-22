# EatyQ - Interactive Digital Menu Platform

Welcome to **EatyQ**! This project allows users to effortlessly create and manage interactive, QR code-based digital menus. The platform is built with the MERN stack, and it provides a user-friendly interface for menu creation, management, and public display via QR codes.

## Table of Contents

- [EatyQ - Interactive Digital Menu Platform](#eatyq---interactive-digital-menu-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Project](#running-the-project)
  - [API Endpoints](#api-endpoints)
  - [Usage](#usage)
    - [Authentication](#authentication)
    - [QR Code Generation (Upcoming)](#qr-code-generation-upcoming)
    - [Public Menu Page (Upcoming)](#public-menu-page-upcoming)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **User Authentication:** Secure login and registration using sessions.
- **Menu Management:** Create, update, and delete menus.
- **Category Management:** Organize menu items into categories.
- **Item Management:** Add, update, and delete items with options for variations.
- **Image Uploads:** Upload item images using Cloudinary.
- **Interactive QR Codes:** (Upcoming) Generate QR codes for public menu pages.
- **Responsive Design:** User-friendly interface with ShadcnUI and TailwindCSS.

## Tech Stack

- **Frontend:** React, TypeScript, TanStack Query, Zustand, ShadcnUI, TailwindCSS
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Authentication:** Express-Session, bcrypt
- **Image Uploads:** Cloudinary, Multer
- **QR Code Generation:** (Upcoming)

## Project Structure

```
mern-eatyq/
├── backend/           # Backend source code
│   ├── src/
│   │   ├── config/    # Configuration files (e.g., Cloudinary)
│   │   ├── controllers/  # Express route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── util/         # Utility functions
│   │   ├── app.ts        # Express app setup
│   │   └── server.ts     # Server startup script
├── frontend/          # Frontend source code
│   ├── src/
│   │   ├── api/        # API service files
│   │   ├── components/ # Reusable components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── layout/     # Layout components
│   │   ├── pages/      # Application pages
│   │   ├── store/      # Zustand stores
│   │   ├── types/      # TypeScript types
│   │   └── main.tsx    # Frontend entry point
├── README.md          # Project README
└── package.json       # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- Cloudinary Account (for image uploads)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/babaygt/eatyq.git
   cd eatyq
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```plaintext
MONGO_URI=your_mongo_db_connection_string
PORT=5000
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Project

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## API Endpoints

- **Users:**

  - `POST /api/users/register`: Register a new user
  - `POST /api/users/login`: Login
  - `POST /api/users/logout`: Logout
  - `GET /api/users/me`: Get the current authenticated user

- **Menus:**

  - `GET /api/menus`: Get all menus for the authenticated user
  - `POST /api/menus`: Create a new menu
  - `GET /api/menus/:menuId`: Get a specific menu
  - `PATCH /api/menus/:menuId`: Update a menu
  - `DELETE /api/menus/:menuId`: Delete a menu

- **Categories:**

  - `GET /api/menus/:menuId/categories`: Get all categories for a menu
  - `POST /api/menus/:menuId/categories`: Create a new category
  - `PUT /api/menus/:menuId/categories/:categoryId`: Update a category
  - `DELETE /api/menus/:menuId/categories/:categoryId`: Delete a category

- **Items:**

  - `GET /api/menus/:menuId/categories/:categoryId/items`: Get all items for a category
  - `POST /api/menus/:menuId/categories/:categoryId/items`: Create a new item
  - `PUT /api/menus/:menuId/categories/:categoryId/items/:itemId`: Update an item
  - `DELETE /api/menus/:menuId/categories/:categoryId/items/:itemId`: Delete an item

- **Images:**
  - `POST /api/image/image`: Upload an image
  - `DELETE /api/image/image/:publicId`: Delete an image

## Usage

### Authentication

1. Register a new account or log in to an existing one.
2. From the dashboard, create a new menu.
3. Add categories to your menu.
4. Add items to your categories, including descriptions, prices, and images.
5. Generate a QR code for your menu to share with customers. (Upcoming)

### QR Code Generation (Upcoming)

The QR code generation functionality is currently under development and will be available soon. This feature will allow restaurant owners to generate QR codes for each menu. Customers can scan these QR codes to directly access the restaurant’s digital menu page.

### Public Menu Page (Upcoming)

The public menu page is accessible via a unique URL generated along with the QR code. It displays the restaurant's menu in an interactive format, allowing patrons to browse categories and items.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
