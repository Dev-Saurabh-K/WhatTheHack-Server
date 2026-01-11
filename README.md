# CampusCart Backend

Welcome to the backend service for **CampusCart**, a college P2P marketplace. This service manages user authentication, item listings, and chat functionality, providing a robust API for the frontend.

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Authentication**: JWT (JSON Web Tokens)
- **Environment Management**: dotenv

## 🛠️ Installation & Setup

Follow these steps to get the backend running locally.

### 1. Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- A MongoDB instance (local or Atlas)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configuration

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campuscart?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

### 4. Run the Server

**Development Mode** (with nodemon):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

## 📂 Folder Structure

```
backend/
├── config/             # Database connection and configuration
├── controllers/        # Logic for handling API requests
│   ├── authController.js
│   ├── itemController.js
│   └── chatController.js
├── models/             # Mongoose schemas (User, Item, Chat)
├── routes/             # API route definitions
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   └── chatRoutes.js
├── middleware/         # Custom middleware (auth, error handling)
├── server.js           # Entry point
└── package.json
```

## 📖 API Documentation

### Authentication (`/api/auth`)

| Method | Endpoint    | Description              | Auth Required |
| :----- | :---------- | :----------------------- | :------------ |
| POST   | `/register` | Register a new user      | No            |
| POST   | `/login`    | Login user & return JWT  | No            |
| GET    | `/me`       | Get current user profile | Yes           |

### Items (`/api/items`)

| Method | Endpoint | Description                   | Auth Required |
| :----- | :------- | :---------------------------- | :------------ |
| GET    | `/`      | Get all items (filter/search) | No            |
| POST   | `/`      | Create a new item listing     | Yes           |
| GET    | `/:id`   | Get specific item details     | No            |
| PUT    | `/:id`   | Update an item listing        | Yes (Owner)   |
| DELETE | `/:id`   | Delete an item listing        | Yes (Owner)   |

### Chat (`/api/chat`)

| Method | Endpoint   | Description              | Auth Required |
| :----- | :--------- | :----------------------- | :------------ |
| POST   | `/`        | Create or access a chat  | Yes           |
| GET    | `/`        | Fetch all chats for user | Yes           |
| POST   | `/message` | Send a message           | Yes           |
