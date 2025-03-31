CREATE TABLE ownerships
(
    driver_id  INT NOT NULL,
    vehicle_id INT NOT NULL,
    notes      TEXT,
    PRIMARY KEY (driver_id, vehicle_id),
    FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE
);
ALTER TABLE ownerships
    ALTER COLUMN notes DROP NOT NULL;
