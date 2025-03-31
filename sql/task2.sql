-- List all drivers and their corresponding cars, regardless of whether they currently own a car or not
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
         LEFT JOIN vehicles_model vm ON v.model_id = vm.id
         LEFT JOIN vehicles_make m ON vm.make_id = m.id;
