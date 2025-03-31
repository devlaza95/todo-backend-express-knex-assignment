-- Look up all vehicles of make Toyota and model Camry. Explain what you see in the query plan for that query. Please explain how that query plan can be expedited so that the query completes faster and more efficiently. Apply the "fix" and demonstrate that the query is now faster.
EXPLAIN ANALYZE
SELECT
    v.id,
    v.license_plate,
    v.year,
    vm.name AS model,
    m.name AS make
FROM vehicles v
         JOIN vehicles_model vm on v.model_id = vm.id
         JOIN vehicles_make m on vm.make_id = m.id
WHERE m.name = 'Toyota' AND vm.name = 'Camry';
