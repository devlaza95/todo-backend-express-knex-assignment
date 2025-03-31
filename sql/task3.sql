-- Who are all of the drivers who drive Toyota or Honda cars. Make sure that each driver is only listed once.
SELECT DISTINCT d.id, d.first_name, d.last_name
FROM drivers d
         JOIN ownerships o on d.id = o.driver_id
         JOIN vehicles v on o.vehicle_id = v.id
         JOIN vehicles_model vm ON v.model_id = vm.id
         JOIN vehicles_make m ON vm.make_id = m.id
WHERE m.name IN ('Toyota', 'Honda');
