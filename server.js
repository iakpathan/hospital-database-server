const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.json()); // Parse JSON request bodies (double inclusion, optional)

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pathan@2005', // Replace with your MySQL password
  database: 'hospitaldb', // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// -------------------- USER ROUTES --------------------

// Signup route
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ success: false, message: 'Error signing up' });
    }
    res.status(201).json({ success: true, message: 'Signup successful' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username or email
  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [username, username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = results[0];

    // Compare the entered password with the hashed password
    if (bcrypt.compareSync(password, user.password)) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid password' });
    }
  });
});
// -------------------- DOCTOR ROUTES --------------------

// Retrieve all doctors
app.get('/doctors', (req, res) => {
  const query = 'SELECT * FROM doctor';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving doctors:', err);
      return res.status(500).json({ error: 'Error retrieving doctors' });
    }
    res.status(200).json(results);
  });
});

// Insert a new doctor
app.post('/doctors', (req, res) => {
  const { name, specialization, phone, email, experience_years, availability } = req.body;
  const query =
    'INSERT INTO doctor (name, specialization, phone, email, experience_years, availability) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, specialization, phone, email, experience_years, availability], (err, result) => {
    if (err) {
      console.error('Error inserting doctor:', err);
      return res.status(500).json({ error: 'Error inserting doctor' });
    }
    res.status(201).json({ message: 'Doctor added successfully' });
  });
});

// Update a doctor
app.put('/doctors/:doctor_id', (req, res) => {
  const { doctor_id } = req.params;
  const { name, specialization, phone, email, experience_years, availability } = req.body;
  const query =
    'UPDATE doctor SET name = ?, specialization = ?, phone = ?, email = ?, experience_years = ?, availability = ? WHERE doctor_id = ?';
  db.query(
    query,
    [name, specialization, phone, email, experience_years, availability, doctor_id],
    (err, result) => {
      if (err) {
        console.error('Error updating doctor:', err);
        return res.status(500).json({ error: 'Error updating doctor' });
      }
      res.status(200).json({ message: 'Doctor updated successfully' });
    }
  );
});

// Delete a doctor
app.delete('/doctors/:doctor_id', (req, res) => {
  const { doctor_id } = req.params;
  const query = 'DELETE FROM doctor WHERE doctor_id = ?';
  db.query(query, [doctor_id], (err, result) => {
    if (err) {
      console.error('Error deleting doctor:', err);
      return res.status(500).json({ error: 'Error deleting doctor' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  });
});

// -------------------- PATIENT ROUTES --------------------

// Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT * FROM patient';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      return res.status(500).json({ error: 'Error retrieving patients' });
    }
    res.status(200).json(results);
  });
});

// Insert a new patient
app.post('/patients', (req, res) => {
  const { name, age, gender, phone, email, address } = req.body;
  const query =
    'INSERT INTO patient (name, age, gender, phone, email, address) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, age, gender, phone, email, address], (err, result) => {
    if (err) {
      console.error('Error inserting patient:', err);
      return res.status(500).json({ error: 'Error inserting patient' });
    }
    res.status(201).json({ message: 'Patient added successfully' });
  });
});

// Update a patient
app.put('/patients/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  const { name, age, gender, phone, email, address } = req.body;
  const query =
    'UPDATE patient SET name = ?, age = ?, gender = ?, phone = ?, email = ?, address = ? WHERE patient_id = ?';
  db.query(query, [name, age, gender, phone, email, address, patient_id], (err, result) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Error updating patient' });
    }
    res.status(200).json({ message: 'Patient updated successfully' });
  });
});

// Delete a patient
app.delete('/patients/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  const query = 'DELETE FROM patient WHERE patient_id = ?';
  db.query(query, [patient_id], (err, result) => {
    if (err) {
      console.error('Error deleting patient:', err);
      return res.status(500).json({ error: 'Error deleting patient' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
});

// -------------------- APPOINTMENT ROUTES --------------------

// Retrieve all appointments
app.get('/appointments', (req, res) => {
  const query = 'SELECT * FROM appointment';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving appointments:', err);
      return res.status(500).json({ error: 'Error retrieving appointments' });
    }
    res.status(200).json(results);
  });
});

// Insert a new appointment
app.post('/appointments', (req, res) => {
  const { doctor_id, patient_id, appointment_date, reason, status } = req.body;
  const query =
    'INSERT INTO appointment (doctor_id, patient_id, appointment_date, reason, status) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [doctor_id, patient_id, appointment_date, reason, status], (err, result) => {
    if (err) {
      console.error('Error inserting appointment:', err);
      return res.status(500).json({ error: 'Error inserting appointment' });
    }
    res.status(201).json({ message: 'Appointment added successfully' });
  });
});

// Update an appointment
app.put('/appointments/:appointment_id', (req, res) => {
  const { appointment_id } = req.params;
  const { doctor_id, patient_id, appointment_date, reason, status } = req.body;
  const query =
    'UPDATE appointment SET doctor_id = ?, patient_id = ?, appointment_date = ?, reason = ?, status = ? WHERE appointment_id = ?';
  db.query(query, [doctor_id, patient_id, appointment_date, reason, status, appointment_id], (err, result) => {
    if (err) {
      console.error('Error updating appointment:', err);
      return res.status(500).json({ error: 'Error updating appointment' });
    }
    res.status(200).json({ message: 'Appointment updated successfully' });
  });
});

// Delete an appointment
app.delete('/appointments/:appointment_id', (req, res) => {
  const { appointment_id } = req.params;
  const query = 'DELETE FROM appointment WHERE appointment_id = ?';
  db.query(query, [appointment_id], (err, result) => {
    if (err) {
      console.error('Error deleting appointment:', err);
      return res.status(500).json({ error: 'Error deleting appointment' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  });
});
// -------------------- DATABASE OPERATIONS --------------------

// TRUNCATE table
app.post('/truncate', (req, res) => {
  const tableName = req.body.table;

  if (!tableName) {
      return res.status(400).json({ error: true, message: 'Table name is required.' });
  }

  const query = `TRUNCATE TABLE \`${tableName}\``;
  db.query(query, (err) => {
      if (err) {
          // Log full error details for debugging
          console.error('Error truncating table:', err);

          // Send a secure error message to the client
          return res.status(500).json({ 
              error: true, 
              message: 'An error occurred while truncating the table. Please check the table name or database permissions.' 
          });
      }
      res.json({ error: false, message: `Table "${tableName}" truncated successfully.` });
  });
});
//union //
app.post('/union', (req, res) => {
  const { query1, query2 } = req.body;

  if (!query1 || !query2) {
    return res.status(400).json({ error: 'Both queries are required.' });
  }

  const unionQuery = `
    (${query1}) 
    UNION 
    (${query2})
  `;

  db.query(unionQuery, (err, results, fields) => {
    if (err) {
      console.error('Error executing UNION query:', err);
      return res.status(500).json({ error: 'Failed to execute UNION query.' });
    }

    const columnNames = fields.map(field => field.name);
    const rows = results.map(row => row);

    res.json({ columnNames, rows });
  });
});

// GRANT permissions
app.post('/grant', (req, res) => {
  const { username, database, table, privileges, host } = req.body;

  // Ensure the necessary fields are provided
  if (!username || !database || !table || !privileges || !host) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Construct the SQL query to grant privileges
  const sql = `GRANT ${privileges} ON \`${database}\`.\`${table}\` TO ?@?`;

  // Execute the GRANT query
  db.query(sql, [username, host], (err, result) => {
    if (err) {
      console.error('Error granting privileges:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // Flush privileges so that the changes take effect
    db.query('FLUSH PRIVILEGES;', (flushErr) => {
      if (flushErr) {
        console.error('Error flushing privileges:', flushErr);
        return res.status(500).json({ success: false, error: flushErr.message });
      }

      // Respond with success message
      res.json({
        success: true,
        message: `Privileges '${privileges}' granted successfully to '${username}' on '${table}' in '${database}' at host '${host}'.`
      });
    });
  });
});




// REVOKE permissions
app.post('/grant', (req, res) => {
  const { username, database, table, privileges, host } = req.body;

  // Ensure the necessary fields are provided
  if (!username || !database || !table || !privileges || !host) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Construct the SQL query to grant privileges
  const sql = `GRANT ${privileges} ON \`${database}\`.\`${table}\` TO ?@?`;

  // Execute the GRANT query
  db.query(sql, [username, host], (err, result) => {
    if (err) {
      console.error('Error granting privileges:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // Flush privileges so that the changes take effect
    db.query('FLUSH PRIVILEGES;', (flushErr) => {
      if (flushErr) {
        console.error('Error flushing privileges:', flushErr);
        return res.status(500).json({ success: false, error: flushErr.message });
      }

      // Respond with success message
      res.json({
        success: true,
        message: `Privileges '${privileges}' granted successfully to '${username}' on '${table}' in '${database}' at host '${host}'.`
      });
    });
  });
});

// Endpoint to handle the REVOKE request
app.post('/revoke', (req, res) => {
  const { username, database, table, privileges, host } = req.body;

  // Ensure the necessary fields are provided
  if (!username || !database || !table || !privileges || !host) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Construct the SQL query to revoke privileges
  const sql = `REVOKE ${privileges} ON \`${database}\`.\`${table}\` FROM ?@?`;

  // Execute the REVOKE query
  db.query(sql, [username, host], (err, result) => {
    if (err) {
      console.error('Error revoking privileges:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // Flush privileges so that the changes take effect
    db.query('FLUSH PRIVILEGES;', (flushErr) => {
      if (flushErr) {
        console.error('Error flushing privileges:', flushErr);
        return res.status(500).json({ success: false, error: flushErr.message });
      }

      // Respond with success message
      res.json({
        success: true,
        message: `Privileges '${privileges}' revoked successfully from '${username}' on '${table}' in '${database}' at host '${host}'.`
      });
    });
  });
});


// ROLLBACK transaction
// Route to handle rollback
app.post('/delete-patient', (req, res) => {
  const { patientId } = req.body;

  // Start a transaction
  db.beginTransaction(err => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Error starting transaction' });
      }

      // Delete appointments first
      db.query('DELETE FROM appointments WHERE patient_id = ?', [patientId], (err, result) => {
          if (err) {
              // Rollback if error
              return db.rollback(() => {
                  return res.status(500).json({ success: false, message: 'Error deleting appointments' });
              });
          }

          // Then delete the patient
          db.query('DELETE FROM patients WHERE patient_id = ?', [patientId], (err, result) => {
              if (err) {
                  // Rollback if error
                  return db.rollback(() => {
                      return res.status(500).json({ success: false, message: 'Error deleting patient' });
                  });
              }

              // Commit the transaction
              db.commit(err => {
                  if (err) {
                      // Rollback if commit fails
                      return db.rollback(() => {
                          return res.status(500).json({ success: false, message: 'Error committing transaction' });
                      });
                  }

                  // Send success response
                  res.json({ success: true, message: 'Patient deleted successfully' });
              });
          });
      });
  });
});

// Commit route

// Rollback route
app.post('/rollback', (req, res) => {
  db.rollback(() => {
      res.json({ error: false, message: 'Transaction rolled back successfully' });
  });
});

// commit//
app.post('/commit', (req, res) => {
  const { operationType, details } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Error starting transaction' });
      return;
    }

    // Execute the query (example: INSERT or UPDATE depending on the details)
    db.query(details, (err, result) => {
      if (err) {
        // If an error occurs, rollback the transaction
        db.rollback(() => {
          res.status(500).json({ success: false, error: 'Error executing query' });
        });
        return;
      }

      // Commit the transaction
      db.commit((err) => {
        if (err) {
          db.rollback(() => {
            res.status(500).json({ success: false, error: 'Error committing transaction' });
          });
          return;
        }

        // Send success response
        res.json({ success: true, result: result });
      });
    });
  });
});

// JOINS (Inner Join Example)
 // Endpoint to perform SQL Joins
app.post('/joins', (req, res) => {
  const { joinType, table1, table2, onCondition } = req.body;

  // Validate input
  if (!joinType || !table1 || !table2 || !onCondition) {
      return res.status(400).json({ error: true, message: 'All fields are required.' });
  }

  // Construct the SQL join query
  let query = '';
  switch (joinType) {
      case 'inner':
          query = `SELECT * FROM ${table1} INNER JOIN ${table2} ON ${onCondition}`;
          break;
      case 'left':
          query = `SELECT * FROM ${table1} LEFT JOIN ${table2} ON ${onCondition}`;
          break;
      case 'right':
          query = `SELECT * FROM ${table1} RIGHT JOIN ${table2} ON ${onCondition}`;
          break;
      case 'full':
          query = `SELECT * FROM ${table1} FULL OUTER JOIN ${table2} ON ${onCondition}`;
          break;
      default:
          return res.status(400).json({ error: true, message: 'Invalid join type.' });
  }

  // Execute the query
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error performing join:', err);
          return res.status(500).json({ error: true, message: 'Failed to perform join. Please check your query and database.' });
      }
      res.json({ error: false, results });
  });
});

//view//

 
app.post('/create-view', (req, res) => {
  const { viewName, viewQuery } = req.body;

  if (!viewName || !viewQuery) {
    return res.status(400).json({ success: false, message: 'Both view name and query are required.' });
  }

  const createViewQuery = `CREATE OR REPLACE VIEW ${viewName} AS ${viewQuery}`;

  db.query(createViewQuery, (err, results) => {
    if (err) {
      console.error('Error creating view:', err);
      return res.status(500).json({ success: false, message: err.sqlMessage || 'Failed to create the view.' });
    }
    res.json({ success: true });
  });
});

// Endpoint to fetch data from a SQL View
app.get('/fetch-view/:viewName', (req, res) => {
  const viewName = req.params.viewName;

  const fetchQuery = `SELECT * FROM ${viewName}`;

  db.query(fetchQuery, (err, results, fields) => {
    if (err) {
      console.error('Error fetching view data:', err);
      return res.status(500).json({ success: false, message: err.sqlMessage || 'Failed to fetch view data.' });
    }

    const columnNames = fields.map(field => field.name);
    res.json({ success: true, columnNames, rows: results });
  });
});

// -------------------- SERVER LISTENING --------------------
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
