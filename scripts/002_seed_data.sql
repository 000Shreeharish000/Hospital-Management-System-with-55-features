-- Insert test staff users (you'll need to create these through auth first)
-- This is sample data structure - actual user IDs will be from Supabase Auth

-- Insert test patients
INSERT INTO public.patients (patient_id, first_name, last_name, date_of_birth, gender, blood_type, phone, email, address, emergency_contact, emergency_phone, allergies, medical_history) VALUES
('PAT001', 'John', 'Doe', '1985-03-15', 'M', 'O+', '555-0101', 'john.doe@email.com', '123 Main St', 'Jane Doe', '555-0102', 'Penicillin', 'Hypertension'),
('PAT002', 'Sarah', 'Smith', '1990-07-22', 'F', 'A+', '555-0103', 'sarah.smith@email.com', '456 Oak Ave', 'Mike Smith', '555-0104', 'None', 'Diabetes Type 2'),
('PAT003', 'Michael', 'Johnson', '1978-11-08', 'M', 'B+', '555-0105', 'michael.j@email.com', '789 Pine Rd', 'Lisa Johnson', '555-0106', 'Aspirin', 'Asthma'),
('PAT004', 'Emily', 'Williams', '1995-05-30', 'F', 'AB-', '555-0107', 'emily.w@email.com', '321 Elm St', 'Robert Williams', '555-0108', 'None', 'None'),
('PAT005', 'David', 'Brown', '1982-09-12', 'M', 'O-', '555-0109', 'david.b@email.com', '654 Maple Dr', 'Anna Brown', '555-0110', 'Sulfa drugs', 'Arthritis');

-- Insert test pharmacy inventory
INSERT INTO public.pharmacy_inventory (medication_name, quantity, unit, reorder_level, price, expiry_date, supplier) VALUES
('Amoxicillin 500mg', 150, 'tablets', 20, 0.50, '2025-12-31', 'PharmaCorp'),
('Metformin 1000mg', 200, 'tablets', 30, 0.75, '2025-11-30', 'MediSupply'),
('Lisinopril 10mg', 100, 'tablets', 15, 1.20, '2025-10-31', 'HealthCare Plus'),
('Omeprazole 20mg', 120, 'capsules', 20, 0.60, '2025-09-30', 'PharmaCorp'),
('Atorvastatin 20mg', 80, 'tablets', 15, 1.50, '2025-08-31', 'MediSupply'),
('Ibuprofen 400mg', 300, 'tablets', 50, 0.25, '2026-01-31', 'HealthCare Plus'),
('Paracetamol 500mg', 250, 'tablets', 40, 0.20, '2026-02-28', 'PharmaCorp');
