
CREATE INDEX idx_vehicles_model_make_id ON vehicles_model(make_id);
CREATE INDEX idx_vehicles_model_id ON vehicles(model_id);

CREATE INDEX idx_ownerships_driver_id ON ownerships(driver_id);
CREATE INDEX idx_ownerships_vehicle_id ON ownerships(vehicle_id);

CREATE INDEX idx_vehicle_make_name ON vehicles_make(name);
CREATE INDEX idx_vehicle_model_name ON vehicles_model(name);

DROP INDEX idx_vehicles_model_make_id;
DROP INDEX idx_vehicles_model_id;
