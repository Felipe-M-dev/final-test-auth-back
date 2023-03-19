CREATE DATABASE felipe_kanriapp;
\c felipe_kanriapp;

CREATE TABLE roles(
	id INT GENERATED ALWAYS AS IDENTITY,
	rol_name VARCHAR(50) NOT NULL,
	rol_description VARCHAR(500),
	PRIMARY KEY(id)
);

CREATE TABLE users ( 
	id SERIAL PRIMARY KEY, 
	email VARCHAR(50) NOT NULL UNIQUE, 
	password VARCHAR(60) NOT NULL, 
 	rol_id INT REFERENCES roles(id)
);

CREATE TABLE servers (
	id INT GENERATED ALWAYS AS IDENTITY,
	hostname VARCHAR(30) NOT NULL,
	ip VARCHAR(30) NOT NULL,
	user_so VARCHAR(30) NOT NULL,
	pass_so VARCHAR(30) NOT NULL,
	ram INT NOT NULL,
	hdd INT NOT NULL,
	cpu INT NOT NULL,
	created_at TIMESTAMP,
	bill_client VARCHAR(2) NOT NULL,
	environment VARCHAR(3) NOT NULL,
	state VARCHAR(3) NOT NULL,
	owner VARCHAR(30) NOT NULL,
	name_so VARCHAR(50) NOT NULL,
	admin VARCHAR(30) NOT NULL,
	client VARCHAR(30) NOT NULL,
	monitoring BOOLEAN NOT NULL,
	db VARCHAR(2),
	engine_db VARCHAR(30),
	user_db VARCHAR(30),
	pass_db VARCHAR(30),
	description VARCHAR(500) NOT NULL,
	PRIMARY KEY(id)	
);