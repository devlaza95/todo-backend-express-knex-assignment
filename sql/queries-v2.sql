create table staging_driver
(
    id         INT,
    first_name VARCHAR(50),
    last_name  VARCHAR(50)
);

create table staging_vehicles
(
    id            INT,
    make          VARCHAR(50),
    model         VARCHAR(50),
    year          INT,
    license_plate VARCHAR(50)
);

create table staging_ownerships (
                                    driver_id INT,
                                    vehicle_id INT,
                                    notes TEXT
);

-- what vehicles are missing from the staging vehicles table in regards to ownerships
SELECT vehicle_id
FROM staging_ownerships
WHERE vehicle_id NOT IN (SELECT id FROM staging_vehicles);

-- what drivers are missing from the staging drivers table in regard to ownerships
SELECT driver_id
FROM staging_ownerships
WHERE driver_id NOT IN (SELECT id from staging_driver);

INSERT INTO staging_driver (id, first_name, last_name)
SELECT DISTINCT s.driver_id, 'Unknown', 'Unknown'
FROM staging_ownerships s
WHERE s.driver_id NOT IN (SELECT id from staging_driver);

INSERT INTO staging_vehicles (id, make, model, year, license_plate)
SELECT DISTINCT s.vehicle_id, 'Unknown', 'Unknown', 0, 'Unknown-' || s.vehicle_id::text
FROM staging_ownerships s
WHERE s.vehicle_id NOT IN (SELECT id FROM staging_vehicles);


CREATE TABLE drivers
(
    id         SERIAL      NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL
);

CREATE TABLE manufacturer
(
    id   SERIAL      NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
)

CREATE TABLE models
(
    id              SERIAL      NOT NULL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    manufacturer_id INT         NOT NULL,
    UNIQUE (name, manufacturer_id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturer (id)
);

CREATE TABLE vehicles
(
    id SERIAL PRIMARY KEY ,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    year INT,
    model_id INT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE
);

CREATE TABLE ownerships
(
    id SERIAL PRIMARY KEY ,
    driver_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    notes TEXT,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE ,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE  CASCADE
);


CREATE INDEX idx_vehicles_model_make_id ON models(manufacturer_id);
CREATE INDEX idx_vehicles_model_id ON vehicles(model_id);

CREATE INDEX idx_ownerships_driver_id ON ownerships(driver_id);
CREATE INDEX idx_ownerships_vehicle_id ON ownerships(vehicle_id);

CREATE INDEX idx_vehicle_make_name ON manufacturer(name);
CREATE INDEX idx_vehicle_model_name ON models(name);

DROP INDEX idx_vehicles_model_make_id;
DROP INDEX idx_vehicles_model_id;

INSERT INTO drivers (id, first_name, last_name)
SELECT id, first_name, last_name
FROM staging_driver;

INSERT INTO manufacturer (name)
SELECT DISTINCT make
FROM staging_vehicles;

INSERT INTO models (name, manufacturer_id)
SELECT DISTINCT s.model, m.id
FROM staging_vehicles s
         JOIN manufacturer m ON s.make = m.name;

INSERT INTO vehicles (id, license_plate, year, model_id)
SELECT s.id, s.license_plate, s.year, ml.id
FROM staging_vehicles s
         JOIN manufacturer m ON s.make = m.name
         JOIN models ml ON s.model = ml.name AND ml.manufacturer_id = m.id;

INSERT INTO ownerships (driver_id, vehicle_id, notes)
SELECT driver_id, vehicle_id, notes
FROM staging_ownerships

SELECT
    v.id,
    v.license_plate,
    v.year,
    vm.name AS model,
    m.name AS make
FROM ownerships o
         JOIN vehicles v ON o.vehicle_id = v.id
         JOIN models vm ON v.model_id = vm.id
         JOIN manufacturer m ON vm.manufacturer_id = m.id
WHERE o.driver_id = 5;

SELECT
    d.id,
    d.first_name,
    d.last_name,
    v.license_plate,
    v.year,
    vm.name AS model,
    m.name AS make
FROM drivers d
         LEFT JOIN ownerships o on d.id = o.driver_id
         LEFT JOIN vehicles v ON o.vehicle_id = v.id
         LEFT JOIN models vm ON v.model_id = vm.id
         LEFT JOIN manufacturer m ON vm.manufacturer_id = m.id;


SELECT DISTINCT d.id, d.first_name, d.last_name
FROM drivers d
         JOIN ownerships o on d.id = o.driver_id
         JOIN vehicles v on o.vehicle_id = v.id
         JOIN models vm ON v.model_id = vm.id
         JOIN manufacturer m ON vm.manufacturer_id = m.id
WHERE m.name IN ('Toyota', 'Honda');

SELECT d.id, d.first_name, d.last_name
FROM drivers d
         JOIN ownerships o on d.id = o.driver_id
         JOIN vehicles v on o.vehicle_id = v.id
         JOIN models vm on v.model_id = vm.id
         JOIN manufacturer m on vm.manufacturer_id = m.id
WHERE m.name IN ('Toyota', 'Honda')
GROUP BY d.id, d.first_name, d.id, d.last_name
HAVING COUNT(DISTINCT m.name) = 2;


BEGIN;

CREATE TABLE manufacturers (...);
CREATE TABLE models (...);
CREATE TABLE newer_vehicles (...);

-- MIgrate data from staging to new tables
-- include all insert statements

COMMIT;

EXPLAIN ANALYZE
SELECT
    v.id,
    v.license_plate,
    v.year,
    vm.name AS model,
    m.name AS make
FROM vehicles v
         JOIN models vm on v.model_id = vm.id
         JOIN manufacturer m on vm.manufacturer_id = m.id
WHERE m.name = 'Toyota' AND vm.name = 'Camry';

