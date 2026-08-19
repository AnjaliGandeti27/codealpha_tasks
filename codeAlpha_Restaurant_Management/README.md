# Restaurant Management System

A backend-based Restaurant Management System developed using **Node.js, Express.js, MongoDB, and Mongoose** as part of my **CodeAlpha Backend Development Internship**.

The project provides REST APIs for managing restaurant menu items, customer orders, tables, reservations, and inventory. It also implements important business logic such as order processing, table availability checking, automatic inventory updates, order cancellation, and linked reservation cancellation.


## 📌 Project Description

The **Restaurant Management System** is a backend application designed to manage important restaurant operations through REST APIs.

The system allows restaurant staff or clients to:

* Manage menu items
* View the restaurant menu
* Create and manage customer orders
* Calculate order totals automatically
* Manage restaurant tables
* Create and manage reservations
* Check table availability for a particular date and time
* Manage inventory for menu items
* Automatically reduce inventory when an order is placed
* Prevent orders when sufficient inventory is not available
* Cancel orders without deleting the order history
* Restore inventory when an order is cancelled
* Link orders with reservations
* Automatically cancel a linked reservation when its order is cancelled

The application is built as a backend REST API and can be tested using **Postman**.

---

## 🎯 Project Purpose

The main purpose of this project is to demonstrate practical backend development skills using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* Database modeling
* Data validation
* Relationships between MongoDB documents
* Business logic
* Error handling
* API testing
* Git and GitHub

---

## ✨ Features

### Menu Management

* Add a new menu item
* View all menu items
* View a specific menu item
* Delete a menu item
* Validate menu item name, price, and category
* Support menu categories:

  * Veg
  * Non-Veg
  * Drinks
  * Desserts

### Order Management

* Create customer orders
* View all orders
* Calculate total price automatically
* Update order status
* Support order statuses:

  * Preparing
  * Served
  * Cancelled
* Prevent orders for unavailable menu items
* Prevent orders when inventory is insufficient
* Keep cancelled orders in the database instead of deleting them
* Restore inventory when an order is cancelled

### Table Management

* Create restaurant tables
* View all tables
* Store table number
* Store table capacity
* Track table status

### Reservation Management

* Create table reservations
* View reservations
* Update reservation status
* Support:

  * Reserved
  * Cancelled
* Check whether a table is already reserved for a specific date and time
* Reject reservations when guest count exceeds table capacity
* Allow a cancelled reservation time slot to become available for another reservation

### Inventory Management

* Create inventory records for menu items
* View inventory
* Update inventory quantities
* Maintain one inventory record per menu item
* Prevent negative inventory quantities
* Automatically reduce inventory when an order is placed
* Automatically restore inventory when an order is cancelled

### Order and Reservation Relationship

Orders can optionally be linked to reservations.

When a linked order is cancelled:

1. The order remains stored in MongoDB.
2. The order status changes to `Cancelled`.
3. The ordered quantity is returned to inventory.
4. The linked reservation is changed to `Cancelled`.

This provides a more realistic restaurant workflow.

---

## 🛠️ Technologies Used

| Technology      | Purpose                                    |
| --------------- | ------------------------------------------ |
| Node.js         | JavaScript runtime                         |
| Express.js      | Backend framework and REST API development |
| MongoDB         | NoSQL database                             |
| Mongoose        | MongoDB object modeling and validation     |
| Postman         | API testing                                |
| MongoDB Compass | Database inspection                        |
| Git             | Version control                            |
| GitHub          | Source code repository                     |
| VS Code         | Development environment                    |

---

## 🏗️ Project Architecture

The application follows this basic flow:

```text
Postman / API Client
        ↓
    Express.js
        ↓
     server.js
        ↓
      Mongoose
        ↓
      MongoDB
```

For example, when an order is created:

```text
POST /orders
        ↓
Check Menu Item
        ↓
Check Inventory
        ↓
Check Reservation (if provided)
        ↓
Calculate Total Price
        ↓
Create Order
        ↓
Reduce Inventory
        ↓
Return Response
```

When an order is cancelled:

```text
PUT /orders/:id
        ↓
Change Order Status → Cancelled
        ↓
Restore Inventory
        ↓
Cancel Linked Reservation
        ↓
Keep Order in Database
```

---

## 📁 Project Structure

```text
Task_3_Restaurant_Management/
│
├── models/
│   ├── Menu.js
│   ├── Order.js
│   ├── Table.js
│   ├── Reservation.js
│   └── Inventory.js
│
├── node_modules/
│
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

### `models/Menu.js`

Defines the menu item schema.

### `models/Order.js`

Defines the order schema and supports a relationship with the Menu and Reservation models.

### `models/Table.js`

Defines restaurant table information.

### `models/Reservation.js`

Defines customer reservations and table relationships.

### `models/Inventory.js`

Defines stock information for menu items.

### `server.js`

Contains the Express server, MongoDB connection, REST APIs, validations, and restaurant business logic.

---

# 🗄️ Database

The project uses a separate MongoDB database:

```text
restaurantmanagement
```

The local MongoDB connection string is:

```text
mongodb://localhost:27017/restaurantmanagement
```

A separate database is used so that the Restaurant Management System data remains independent from the databases used by the previous CodeAlpha projects.

Previous projects use different databases such as:

```text
urlshortener
eventregistration
```

---

# 📦 Database Models

## 1. Menu Model

The Menu model stores restaurant food and drink information.

### Fields

| Field       | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| `name`      | String  | Name of the menu item             |
| `price`     | Number  | Price of the item                 |
| `category`  | String  | Veg, Non-Veg, Drinks, or Desserts |
| `available` | Boolean | Whether the item is available     |

### Validation

* Name is required.
* Price is required.
* Price cannot be negative.
* Category must be one of:

  * Veg
  * Non-Veg
  * Drinks
  * Desserts
* Availability defaults to `true`.

---

## 2. Order Model

The Order model stores customer orders.

### Fields

| Field          | Type     | Description                                  |
| -------------- | -------- | -------------------------------------------- |
| `customerName` | String   | Customer name                                |
| `menuItem`     | ObjectId | Reference to a Menu document                 |
| `reservation`  | ObjectId | Optional reference to a Reservation document |
| `quantity`     | Number   | Number of items ordered                      |
| `totalPrice`   | Number   | Automatically calculated total               |
| `status`       | String   | Preparing, Served, or Cancelled              |

### Order Relationship

```text
Order
 ├── menuItem → Menu
 └── reservation → Reservation
```

### Order Total Calculation

If a customer orders 2 Chicken Biryanis:

```text
Chicken Biryani Price = ₹220
Quantity = 2

Total Price = ₹220 × 2
            = ₹440
```

The client does not need to send the final price. The backend calculates it using the current menu price.

---

## 3. Table Model

The Table model stores restaurant tables.

### Fields

| Field         | Type   | Description              |
| ------------- | ------ | ------------------------ |
| `tableNumber` | Number | Unique table number      |
| `capacity`    | Number | Maximum number of guests |
| `status`      | String | Available or Occupied    |

### Validation

* Table number is required.
* Table numbers are unique.
* Capacity must be at least 1.
* Status can be:

  * Available
  * Occupied

---

## 4. Reservation Model

The Reservation model stores table reservations.

### Fields

| Field             | Type     | Description                   |
| ----------------- | -------- | ----------------------------- |
| `customerName`    | String   | Customer name                 |
| `table`           | ObjectId | Reference to a Table document |
| `reservationDate` | String   | Reservation date              |
| `reservationTime` | String   | Reservation time              |
| `guests`          | Number   | Number of guests              |
| `status`          | String   | Reserved or Cancelled         |

### Date Format

```text
YYYY-MM-DD
```

Example:

```text
2026-08-20
```

### Time Format

```text
HH:MM
```

Example:

```text
19:00
```

---

## 5. Inventory Model

The Inventory model stores available stock for each menu item.

### Fields

| Field               | Type     | Description                  |
| ------------------- | -------- | ---------------------------- |
| `menuItem`          | ObjectId | Reference to a Menu document |
| `quantityAvailable` | Number   | Current stock                |

Each menu item has one inventory record.

---

# 🔗 Model Relationships

The project uses Mongoose references to connect related records.

```text
Menu
 ↑
 │
 ├──────────── Order
 │               │
 │               └── Reservation
 │
 └──────────── Inventory

Reservation
     ↑
     │
   Table
```

### Examples

An order can reference a menu item:

```text
Order → Chicken Biryani
```

An inventory record references the same menu item:

```text
Inventory → Chicken Biryani
```

A reservation references a table:

```text
Reservation → Table 2
```

An order can optionally reference a reservation:

```text
Order → Reservation → Table
```

---

# 🌐 REST API Endpoints

## Menu APIs

| Method | Endpoint    | Purpose             |
| ------ | ----------- | ------------------- |
| POST   | `/menu`     | Add menu item       |
| GET    | `/menu`     | View all menu items |
| GET    | `/menu/:id` | View one menu item  |
| DELETE | `/menu/:id` | Delete menu item    |

---

## Order APIs

| Method | Endpoint      | Purpose                            |
| ------ | ------------- | ---------------------------------- |
| POST   | `/orders`     | Create order                       |
| GET    | `/orders`     | View all orders                    |
| PUT    | `/orders/:id` | Update order status / cancel order |

---

## Table APIs

| Method | Endpoint  | Purpose         |
| ------ | --------- | --------------- |
| POST   | `/tables` | Create table    |
| GET    | `/tables` | View all tables |

---

## Reservation APIs

| Method | Endpoint            | Purpose                   |
| ------ | ------------------- | ------------------------- |
| POST   | `/reservations`     | Create reservation        |
| GET    | `/reservations`     | View reservations         |
| PUT    | `/reservations/:id` | Update reservation status |

---

## Inventory APIs

| Method | Endpoint         | Purpose                   |
| ------ | ---------------- | ------------------------- |
| POST   | `/inventory`     | Create inventory record   |
| GET    | `/inventory`     | View inventory            |
| PUT    | `/inventory/:id` | Update inventory quantity |

---

# 🧪 API Request Examples

## Add a Menu Item

### Request

```http
POST http://localhost:3000/menu
```

### JSON Body

```json
{
  "name": "Chicken Biryani",
  "price": 220,
  "category": "Non-Veg",
  "available": true
}
```

### Example Response

```json
{
  "message": "Menu item added successfully",
  "menuItem": {
    "name": "Chicken Biryani",
    "price": 220,
    "category": "Non-Veg",
    "available": true
  }
}
```

---

## View Menu

```http
GET http://localhost:3000/menu
```

Returns all menu items stored in MongoDB.

---

## View One Menu Item

```http
GET http://localhost:3000/menu/:id
```

Example:

```http
GET http://localhost:3000/menu/6a81bd064b3cac3c89bebe82
```

---

## Create an Order

```http
POST http://localhost:3000/orders
```

Example:

```json
{
  "customerName": "Kiran",
  "menuItem": "6a81bd064b3cac3c89bebe82",
  "reservation": "YOUR_RESERVATION_ID",
  "quantity": 2
}
```

The backend calculates the total price automatically.

For example:

```text
₹220 × 2 = ₹440
```

---

## Update Order Status

```http
PUT http://localhost:3000/orders/ORDER_ID
```

Example:

```json
{
  "status": "Served"
}
```

Valid order statuses are:

```text
Preparing
Served
Cancelled
```

---

## Cancel an Order

```http
PUT http://localhost:3000/orders/ORDER_ID
```

Body:

```json
{
  "status": "Cancelled"
}
```

When a linked order is cancelled:

* The order remains in MongoDB.
* Order status becomes `Cancelled`.
* Inventory is restored.
* The linked reservation becomes `Cancelled`.

---

## Create a Table

```http
POST http://localhost:3000/tables
```

Example:

```json
{
  "tableNumber": 2,
  "capacity": 4
}
```

---

## View Tables

```http
GET http://localhost:3000/tables
```

---

## Create a Reservation

```http
POST http://localhost:3000/reservations
```

Example:

```json
{
  "customerName": "Anjali",
  "table": "TABLE_ID",
  "reservationDate": "2026-08-20",
  "reservationTime": "19:00",
  "guests": 3
}
```

---

## View Reservations

```http
GET http://localhost:3000/reservations
```

---

## Cancel a Reservation

```http
PUT http://localhost:3000/reservations/RESERVATION_ID
```

Example:

```json
{
  "status": "Cancelled"
}
```

---

## Create an Inventory Record

```http
POST http://localhost:3000/inventory
```

Example:

```json
{
  "menuItem": "MENU_ITEM_ID",
  "quantityAvailable": 20
}
```

---

## View Inventory

```http
GET http://localhost:3000/inventory
```

---

## Update Inventory

```http
PUT http://localhost:3000/inventory/INVENTORY_ID
```

Example:

```json
{
  "quantityAvailable": 25
}
```

---

# 🔄 Business Logic

## 1. Order Processing

When an order is created:

```text
Client
  ↓
Check Menu Item
  ↓
Check Menu Availability
  ↓
Check Inventory
  ↓
Check Reservation if provided
  ↓
Calculate Total Price
  ↓
Create Order
  ↓
Reduce Inventory
  ↓
Return Response
```

---

## 2. Automatic Inventory Update

Suppose inventory contains:

```text
Chicken Biryani = 20
```

Customer orders:

```text
Quantity = 2
```

The backend automatically changes:

```text
20 - 2 = 18
```

The response also includes the remaining inventory quantity.

---

## 3. Insufficient Inventory Protection

If:

```text
Available stock = 18
Requested quantity = 50
```

the backend rejects the order.

The response includes an error such as:

```json
{
  "message": "Insufficient inventory for this menu item",
  "availableQuantity": 18
}
```

No invalid negative inventory is created.

---

## 4. Order Cancellation

If an order with quantity `2` is cancelled:

```text
Order Status
Preparing
   ↓
Cancelled
```

The order remains in MongoDB.

Inventory is restored:

```text
18 + 2 = 20
```

If the order has a linked reservation, the reservation is also changed to:

```text
Cancelled
```

---

## 5. Table Availability Checking

When a reservation is created, the backend checks:

1. Whether the table exists.
2. Whether the number of guests fits the table capacity.
3. Whether another active reservation already exists for the same table, date, and time.

For example:

```text
Table 2
2026-08-21
20:00
```

If the same table is already reserved at that time, another reservation request is rejected.

If the earlier reservation is cancelled, the time slot becomes available for another reservation.

---

# ✅ Validation and Error Handling

The system handles several invalid cases.

### Menu validation

* Missing menu name
* Missing price
* Missing category
* Negative price
* Invalid category

### Order validation

* Missing customer name
* Missing menu item ID
* Missing quantity
* Invalid menu item
* Unavailable menu item
* Missing inventory record
* Insufficient inventory
* Invalid order status

### Reservation validation

* Non-existing table
* Guest count greater than table capacity
* Duplicate reservation for the same table/date/time
* Invalid reservation status
* Invalid date/time formats

### Inventory validation

* Non-existing menu item
* Duplicate inventory record for the same menu item
* Negative inventory quantity
* Non-existing inventory record

### MongoDB ID validation

Invalid MongoDB IDs are handled with appropriate error responses instead of silently failing.

---

# ▶️ Installation and Setup

## 1. Clone or download the repository

Navigate to the project directory:

```text
codealpha_tasks/Task_3_Restaurant_Management
```

---

## 2. Install dependencies

Run:

```bash
npm install
```

This installs the dependencies from `package.json`.

---

## 3. Start MongoDB

Make sure your local MongoDB service is running.

MongoDB Compass can be used to verify the local MongoDB connection.

---

## 4. Start the server

Run:

```bash
npm start
```

The terminal should show:

```text
Server is running on port 3000
MongoDB connected successfully
```

---

# 🌍 Base URL

The backend runs on:

```text
http://localhost:3000
```

---

# 🧪 Testing with Postman

Postman was used to test the REST APIs.

The testing process includes:

```text
1. Start MongoDB
2. Start the Node.js server
3. Open Postman
4. Send API requests
5. Check HTTP status codes
6. Check JSON responses
7. Verify stored data in MongoDB Compass
```

Important API tests include:

* Creating menu items
* Viewing the menu
* Creating orders
* Calculating order totals
* Updating order status
* Cancelling orders
* Checking inventory
* Automatic inventory reduction
* Inventory restoration after cancellation
* Creating tables
* Creating reservations
* Rejecting duplicate reservations
* Rejecting reservations exceeding table capacity
* Cancelling reservations
* Linking orders with reservations

---

# 🗃️ MongoDB Compass Verification

The project uses the database:

```text
restaurantmanagement
```

The database contains collections corresponding to the application models:

```text
menus
orders
tables
reservations
inventories
```

MongoDB Compass can be used to inspect:

* Documents
* Object IDs
* Menu information
* Order information
* Reservation information
* Table information
* Inventory quantities
* Created and updated timestamps

---

# 🔐 Git and GitHub

The project is part of the existing CodeAlpha repository:

```text
codealpha_tasks
```

The repository contains:

```text
Task_1_URL_Shortener
Task_2_Event_Registration
Task_3_Restaurant_Management
```

Task 3 is maintained inside the same Git repository rather than using a separate repository.

---

# 🚫 `.gitignore`

The repository-level `.gitignore` is used to prevent unnecessary files from being uploaded.

Important ignored items include:

```text
node_modules/
.env
```

`node_modules` should not be uploaded because the required packages can be recreated using:

```bash
npm install
```

---

# 📚 What I Learned

Through this project, I practiced:

* Building REST APIs with Express.js
* Creating Node.js backend applications
* Connecting Node.js with MongoDB
* Using Mongoose schemas and models
* Working with MongoDB ObjectIds
* Creating relationships between models
* Performing CRUD operations
* Validating user input
* Handling API errors
* Implementing business logic
* Managing restaurant orders
* Managing restaurant reservations
* Checking table availability
* Managing inventory
* Implementing automatic inventory updates
* Testing APIs with Postman
* Verifying database data with MongoDB Compass
* Managing source code using Git
* Uploading projects to GitHub

---

# 🔮 Future Improvements

The current project focuses on the required backend restaurant operations.

Possible future improvements include:

* Customer authentication and authorization
* Staff/admin login
* Role-based access control
* Restaurant dashboard
* Online payment integration
* Detailed sales reports
* Billing and invoice generation
* More advanced ingredient-level inventory management
* Real-time order tracking
* Search and filtering for menu items
* Reservation notifications
* Frontend web or mobile application

---

# ✅ Project Status

The Restaurant Management System backend has been developed and tested using:

```text
Node.js
Express.js
MongoDB
Mongoose
Postman
MongoDB Compass
Git
GitHub
```

The project demonstrates menu management, order management, table management, reservation management, inventory management, validation, business logic, and database relationships.

---

## 👩‍💻 Author

**Anjali Gandeti**

CodeAlpha Backend Development Internship

---

## 📌 Repository

GitHub repository:

```text
https://github.com/AnjaliGandeti27/codealpha_tasks
```
