# IP Navigator

IP Navigator is a modern full-stack SaaS web application designed to help users work with both IPv4 and IPv6 addresses efficiently. It provides a clean, responsive, and professional interface to execute powerful networking tools such as subnet calculation, IP validation, and network analysis.

## Features

* **IPv4 & IPv6 Validation**: Instantly detect and validate IP addresses.
* **Subnet Intelligence**: Calculate CIDR blocks, wildcard masks, and find total/usable hosts.
* **Network Structure**: Detect public, private, loopback, multicast, or reserved IPs.
* **IP Format Conversion**: Handle IPv6 compressed & expanded formats easily.
* **Dashboard & History**: Track search history and save customized reports in a secure personal dashboard.
* **Secure Authentication**: Robust user login and registration system secured through JWT and bcrypt.
* **Modern UI/UX**: Built with Framer Motion, glassmorphism aesthetics, dark mode support, and Tailwind CSS.

## Tech Stack

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Framer Motion**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Tokens)**
- **bcryptjs**

## Getting Started

Follow the instructions below to get a local copy up and running.

### Prerequisites

* Node.js (v18+)
* MongoDB running locally or a MongoDB URI connection string.

### Installation & Setup

1. **Clone or Download the Repository:**
   Ensure you are in the project's root folder (`IP Navigator`).

2. **Backend Setup:**
   ```bash
   cd backend
   # Install dependencies
   npm install

   # (Optional) Create a .env file and add your MongoDB connection string and JWT secret
   # PORT=5000
   # MONGO_URI=mongodb://127.0.0.1:27017/ip_navigator
   # JWT_SECRET=your_jwt_secret

   # Start the Express server
   npm run dev
   ```
   *The backend will boot up normally at `http://localhost:5000`.*

3. **Frontend Setup:**
   Open a **new terminal tab/window**.
   ```bash
   cd frontend
   # Install dependencies
   npm install

   # Start the Vite development server
   npm run dev
   ```
   *The frontend will boot up at `http://localhost:5173`. Open this URL in your browser.*

---

## Folder Structure Summary

* `/backend` - Express API server, MongoDB models, Controllers, Logic services, Authentication middleware.
* `/frontend` - Vite React App, Pages, Navigation Components, UI layouts, State management, Tailwind configs.

## Contributing

Contributions, issues, and feature requests are welcome!

## License

This project is licensed under the ISC License.
