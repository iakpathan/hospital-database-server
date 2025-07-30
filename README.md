
# Hospital Database Management System

This is a web-based hospital management application developed using **Node.js**, **Express.js**, **MySQL**, **HTML/CSS**, and JavaScript. The system allows patients, doctors, and appointments to be managed efficiently with CRUD functionality.

---

## Requirements

Before setting up this project, make sure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)
- **MySQL Server**
- **VS Code or any IDE**
- **Google Chrome** or any modern browser

---

##  Pre-installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iakpathan/hospital-database-server.git
   cd hospital-database-server
````

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up MySQL Database**:

   * Create a database named `hospitaldb`.
   * Create tables: `users`, `patient`, `doctor`, `appointment`.
   * Use the SQL schema provided (add your schema if not yet included).

4. **Update database credentials** in `server.js`:

   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'yourpassword',
     database: 'hospitaldb'
   });
   ```

5. **Start the server**:

   ```bash
   node server.js
   ```

6. **Access the application**:
   Open your browser and go to `http://localhost:3000`.

---

## Folder & File Structure

```
hospital-management-system/
│
├── css/                   # Contains stylesheets (if separated)
│
├── html/                  # Additional HTML files (e.g., about, contact)
│
├── image/                 # Static images used in the web pages
│
├── node_modules/          # Installed npm dependencies
│
├── index.html             # Main homepage (frontend UI)
├── styles.css             # Linked CSS stylesheet
├── server.js              # Express backend server file (API routes)
├── package.json           # Project config and dependencies
├── package-lock.json      # Dependency lock file
└── README.md              # Project documentation (this file)
```

---

## Key Features

*  **User Authentication**: Secure signup and login using bcrypt.
*  **Patient Records**: CRUD operations on patient data.
*  **Doctor Management**: Add, update, view, or delete doctor entries.
*  **Appointments**: Book and manage appointments between patients and doctors.
*  **API Integration**: RESTful API support with JSON communication.
*  **MySQL Database**: Handles all structured data operations.

---

##  Notes

* Make sure MySQL is running before you start the server.
* Adjust port and database credentials as per your environment.
* All passwords are hashed using bcrypt for security.

---

## Future Enhancements

* Add email/SMS notifications.
* Dashboard with analytics and charts.
* Role-based access control (Admin, Doctor, Patient).
* Deploy on cloud platforms like Heroku or Render.

---

##  Author

Developed by **[iakpathan](https://github.com/iakpathan)** – for academic and learning purposes.

---


