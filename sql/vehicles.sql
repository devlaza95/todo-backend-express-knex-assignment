CREATE TABLE vehicles_make
(
    id   SERIAL      NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE vehicles_model
(
    id      SERIAL      NOT NULL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL,
    make_id INT         NOT NULL,
    FOREIGN KEY (make_id) REFERENCES vehicles_make (id) ON DELETE CASCADE
);

ALTER TABLE vehicles_model
    ADD CONSTRAINT UQ_make_id_name UNIQUE (make_id,name);

-- ALTER TABLE vehicles_model
--     DROP CONSTRAINT UQ_make_id_name;
-- ALTER TABLE vehicles_model
--     DROP CONSTRAINT 'vehicles_model_name_key';

CREATE TABLE vehicles
(
    id            SERIAL             NOT NULL PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    model_id      INT                NOT NULL,
    year          INT                NOT NULL,
    FOREIGN KEY (model_id) REFERENCES vehicles_model (id) ON DELETE CASCADE
);

CREATE TABLE staging_vehicles
(
    license_plate VARCHAR(20),
    year          INT,
    make          VARCHAR(50),
    model         VARCHAR(50)
);

INSERT INTO vehicles_make (name)
SELECT DISTINCT make
FROM staging_vehicles;

INSERT INTO vehicles_model (make_id, name)
SELECT DISTINCT vm.id, s.model
FROM staging_vehicles s
         JOIN vehicles_make vm ON s.make = vm.name;

SELECT * FROM staging_vehicles;

WITH unique_staging_values AS (
    SELECT DISTINCT ON (license_plate) * FROM staging_vehicles ORDER BY license_plate
)
INSERT INTO vehicles (license_plate, model_id, year)
SELECT s.license_plate, vm.id, s.year
FROM unique_staging_values s
         JOIN vehicles_make m ON s.make = m.name
         JOIN vehicles_model vm ON m.id = vm.make_id AND s.model = vm.name;
