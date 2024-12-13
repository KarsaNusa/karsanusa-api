# karsanusa-api

# Karsanusa API

Karsanusa API is a backend RESTful API designed to manage user authentication, discussion forums, and other services such as batik prediction. This API is built using Node.js, Express.js, and Firestore as the primary database.

## Key Features

### 1. User Authentication
- **Registration** of new users with data validation.
- **Login** for users using JWT tokens.
- **User profile** accessible through secured endpoints.

### 2. Discussion Forum
- **Send messages** in the forum with file upload support (images).
- **View message details** by message ID.
- **Delete messages** from the forum.

### 3. Integration with Google Cloud Firestore
- All data is stored and managed using Firestore.

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/username/karsanusa-api.git
cd karsanusa-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following content:
```env
PORT=3000
GCP_PROJECT_ID=your-google-cloud-project-id
FIRESTORE_KEY_PATH=path-to-your-service-account-key.json
JWT_SECRET=your-secret-key
```

### 4. Run the Application
To run the application:
- **Development Mode:**
```bash
npm run dev
```
- **Production Mode:**
```bash
npm start
```

---

## API Endpoints

### 1. Authentication

#### POST `/api/auth/register`
**Description:** Endpoint for user registration.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }
  ```
- **Successful Response:**
  ```json
  {
    "message": "User successfully registered",
    "userId": "abc123"
  }
  ```

#### POST `/api/auth/login`
**Description:** Endpoint for user login.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Successful Response:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt-token",
    "userId": "abc123",
    "fullName": "John Doe"
  }
  ```

#### GET `/api/auth/profile`
**Description:** Endpoint to retrieve the user's profile.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Successful Response:**
  ```json
  {
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-12-12T12:00:00Z"
  }
  ```

### 2. Discussion Forum

#### POST `/api/forum/messages`
**Description:** Send a message to the forum.
- **Request Body:**
  ```json
  {
    "message": "This is a forum message",
    "userId": "abc123"
  }
  ```
- **Optional File:** Upload an image with the key `image`.
- **Successful Response:**
  ```json
  {
    "message": "Message sent successfully.",
    "data": {
      "id": "message123",
      "userId": "abc123",
      "message": "This is a forum message",
      "imagePath": "uploads/image123.jpg",
      "createdAt": "2024-12-12T12:00:00Z"
    }
  }
  ```

#### GET `/api/forum/messages/:messageId`
**Description:** Retrieve message details by ID.
- **Successful Response:**
  ```json
  {
    "message": "Message found.",
    "data": {
      "id": "message123",
      "userId": "abc123",
      "message": "This is a forum message",
      "imagePath": "uploads/image123.jpg",
      "createdAt": "2024-12-12T12:00:00Z"
    }
  }
  ```

#### DELETE `/api/forum/messages/:messageId`
**Description:** Delete a message by ID.
- **Successful Response:**
  ```json
  {
    "message": "Message deleted successfully."
  }
  ```

---

## Project Structure

```
karsanusa-api/
├── src/
│   ├── config/
│   │   └── firestore.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── forumRoutes.js
│   └── server.js
├── uploads/
├── .env
├── package.json
└── README.md
```

---

## Contribution
1. Fork this repository.
2. Create a new feature branch.
3. Make your changes and commit them.
4. Submit a pull request.

---

## License
This application is licensed under the [MIT License](LICENSE).

