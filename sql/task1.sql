-- All vehicles for driver with id 5 --
SELECT
    v.id,
    v.license_plate,
    v.year,
    vm.name AS model,
    m.name AS make
FROM ownerships o
         JOIN vehicles v ON o.vehicle_id = v.id
         JOIN vehicles_model vm ON v.model_id = vm.id
         JOIN vehicles_make m ON vm.make_id = m.id
WHERE o.driver_id = 5;
