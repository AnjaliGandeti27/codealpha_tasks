# Simple URL Shortener

A backend-based URL Shortener developed using Node.js, Express.js, MongoDB, and Mongoose as part of my CodeAlpha Backend Development Internship.

## 👩‍💻 Author

**Anjali Gandeti**

## 📌 About the Project

The Simple URL Shortener converts a long URL into a shorter URL.

For example:

**Original URL:**
https://www.google.com

**Short URL:**
http://localhost:3000/isst6z

When the short URL is opened in a browser, the application finds the original URL from MongoDB and redirects the user to the original website.

## ✨ Features

* Accepts long URLs through a REST API
* Generates a unique short code for each URL
* Stores the original URL and short code in MongoDB
* Returns a shortened URL
* Redirects the shortened URL to the original website
* Validates URL input
* Handles missing URLs
* Handles invalid URLs
* Handles short codes that do not exist

## 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* Postman
* Git and GitHub

## 📂 Project Structure

```text
URL-Shortener/
│
├── models/
│   └── Url.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## 🔄 How It Works

1. The user sends a long URL to the `/shorten` API.
2. The Express.js server receives the URL.
3. A unique short code is generated.
4. The original URL and short code are stored in MongoDB.
5. The server returns the shortened URL.
6. When the shortened URL is opened, the server searches MongoDB using the short code.
7. The user is redirected to the original URL.

## 📡 API Endpoint

### Shorten URL

**Method:** `POST`

**URL:**

```text
http://localhost:3000/shorten
```

### Request Body

Select **Body → raw → JSON** in Postman and send:

```json
{
    "longUrl": "https://www.google.com"
}
```

### Example Response

```json
{
    "message": "URL shortened successfully",
    "shortUrl": "http://localhost:3000/isst6z"
}
```

The short code is generated dynamically, so it may be different for each URL.

## 🔗 URL Redirection

After receiving the shortened URL, open it in a browser.

For example:

```text
http://localhost:3000/isst6z
```

The application searches for the short code `isst6z` in MongoDB and redirects the user to the original URL.

## 🗄️ Database

The project uses MongoDB to store the URL mappings.

**Database:** `urlshortener`

**Collection:** `urls`

Each URL mapping contains:

* Original URL
* Short code

## ▶️ How to Run the Project

### 1. Start MongoDB

Make sure MongoDB is running on the computer.

### 2. Open the project

Open the `URL-Shortener` folder in VS Code.

### 3. Start the server

Open the VS Code terminal and run:

```bash
node server.js
```

### 4. Expected Output

```text
MongoDB connected successfully
Server is running on port 3000
```

### 5. Test the API

Open Postman and send a `POST` request to:

```text
http://localhost:3000/shorten
```

with a valid long URL in the JSON request body.

## 🎯 Project Objective

The objective of this project is to build a simple backend URL shortening service that demonstrates REST API development, database integration, URL mapping, short code generation, and URL redirection using Node.js, Express.js, MongoDB, and Mongoose.

## 📚 CodeAlpha Internship

This project was developed as part of the **CodeAlpha Backend Development Internship**.

The project demonstrates practical backend development concepts including API creation, database connectivity, data storage, URL shortening, and redirection.
