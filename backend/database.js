// Import the necessary modules for MySQL connection and environment variable management
import mysql from 'mysql2'
import dotenv from 'dotenv'
import { User, Patient, Doctor, Admin } from './classes.js'

// Load environment variables from the .env file
dotenv.config()

// Create a connection pool to MySQL database using values from environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,           // MySQL host (e.g., localhost)
  user: process.env.MYSQL_USER,           // MySQL user
  password: process.env.MYSQL_PASSWORD,   // MySQL password
  port: process.env.MYSQL_PORT,           // MySQL port (default: 3306)
  database: process.env.MYSQL_DATABASE    // MySQL database name
}).promise()  // Return a promise-based connection pool

// test database connection
export async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors'); // Execute a simple query
    console.log('Database connection successful:', rows);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Create user in database
export async function createUser(userData) {
  try {
    // First create User instance with hashed password
    const user = await User.create(
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.password
    );

    const [result] = await pool.query(`
      INSERT INTO users
      (first_name, last_name, email, password)
      VALUES (?, ?, ?, ?)
    `, [
      user.first_name,
      user.last_name,
      user.email,
      user.password
    ]);

    return result;
  } catch (error) {
      console.error('Error creating user:', error);
      throw error;
  }
}

export async function createDoctor(doctorData) {
  const [result] = await pool.query(`
    INSERT INTO doctors 
    (user_id, specialty, license_number) 
    VALUES (?, ?, ?)
  `, [
    doctorData.id, // Assuming you have user ID from initial registration
    doctorData.specialty,
    doctorData.license_number
  ]);
  return result;
}

export async function createPatient(patientData) {
  const [result] = await pool.query(`
    INSERT INTO patients 
    (user_id, date_of_birth, insurance_provider) 
    VALUES (?, ?, ?)
  `, [
    patientData.id, // Assuming you have user ID from initial registration
    patientData.date_of_birth,
    patientData.insurance_provider
  ]);
  return result;
}

// Fetch and return a list of all patients from the 'patients' table
export async function getPatientList() {
  const [rows] = await pool.query("SELECT * FROM patients")  // Query to get all patients
  return rows  // Return the list of patients
}

// Fetch and return a list of all doctors from the 'doctors' table
export async function getDoctorList() {
  const [rows] = await pool.query("SELECT * FROM doctors")   // Query to get all doctors
  return rows  // Return the list of doctors
}

// Fetch and return a specific patient by their patient ID
export async function getPatient(id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM patients
    WHERE patient_id = ?  // Use a parameterized query to avoid SQL injection
  `, [id])  // Pass the patient ID as a parameter
  return rows[0]  // Return the patient object (only one result)
}

// Fetch and return a specific doctor by their doctor ID
export async function getDoctor(id) {
  const [rows] = await pool.query(`
    SELECT * 
    FROM doctors
    WHERE doctor_id = ?  // Use a parameterized query to avoid SQL injection
  `, [id])  // Pass the doctor ID as a parameter
  return rows[0]  // Return the doctor object (only one result)
}


// Export the pool for use in other parts of the application
export default pool

