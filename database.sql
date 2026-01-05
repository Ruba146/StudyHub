CREATE DATABASE studyhub_db;
USE studyhub_db;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    gender VARCHAR(10),
    mobile VARCHAR(15),
    dob DATE,
    email VARCHAR(100),
    language VARCHAR(20),
    message TEXT
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    code VARCHAR(20),
    credits INT,
    notes TEXT
);

CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100),
    title VARCHAR(150),
    type VARCHAR(20) DEFAULT 'Assignment',  
    due_date DATE,
    status VARCHAR(20),
    grade VARCHAR(10),                     
    notes TEXT
);