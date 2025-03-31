--Who are all the drivers who own both a Toyota and a Honda car at the same time. Make sure that each driver is only listed once.
SELECT d.id, d.first_name, d.last_name
FROM drivers d
         JOIN ownerships o on d.id = o.driver_id
         JOIN vehicles v on o.vehicle_id = v.id
         JOIN vehicles_model vm on v.model_id = vm.id
         JOIN vehicles_make m on vm.make_id = m.id
WHERE m.name IN ('Toyota', 'Honda')
GROUP BY d.id, d.first_name, d.id, d.last_name
HAVING COUNT(DISTINCT m.name) = 2;
