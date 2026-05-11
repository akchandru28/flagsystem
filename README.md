# ⚡ Byepo - Multi-Tenant Feature Flag Management System

A robust, multi-tenant application for managing feature flags across different organizations. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), this system provides isolated environments for different roles to securely manage and consume feature flags.

## 🌟 Features & Access Roles

The system is split into three distinct portals based on access levels:

1. **Super Admin Portal**
   - System-level access.
   - Logs in using secure, static credentials configured via environment variables.
   - Responsible for creating and monitoring all organizations on the platform.

2. **Organization Admin Portal**
   - Tenant-level access.
   - Users can sign up, log in, and associate themselves with a specific organization.
   - Full CRUD (Create, Read, Update, Delete) capabilities for their organization's feature flags.

3. **End User Portal**
   - Public-facing checker.
   - Users can select an organization and query a specific feature key.
   - The system accurately reports whether the queried feature flag is currently `ENABLED` or `DISABLED` for that specific organization.

## 🛠️ Tech Stack

- **Frontend:** React, React Router (v6), Axios, Custom CSS Styling
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** JSON Web Tokens (JWT) for session management, bcryptjs for password hashing.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/featureflags
JWT_SECRET=your_super_secret_jwt_key
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin123
```

Start the backend development server:

```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory to link the frontend to your backend API:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React development server:

```bash
npm start
```

## 🌐 Usage Guide

Once both servers are running:
1. Open your browser and navigate to `http://localhost:3000`.
2. You will be greeted with the **Portal Selection** home screen.
3. **Step 1:** Log into the **Super Admin** portal using the credentials you defined in the backend `.env` file and create your first organization.
4. **Step 2:** Navigate back to home and enter the **Admin Portal**. Sign up for an account under the organization you just created. From here, you can start toggling feature flags!
5. **Step 3:** Use the **User Portal** to verify the status of the flags you created.

## 🔒 Security & Routing

- **Protected Routes:** Ensure that unauthorized users cannot access admin or super-admin dashboards.
- **Intelligent Redirection:** Automatically routes authenticated users back to their respective dashboards if they attempt to view a login page while a session is active.
- **Data Isolation:** All feature flags are strictly scoped to their respective `organizationId`, meaning data does not bleed across tenants.

## 📄 License

This project is licensed under the MIT License.
