# Hospital Management System - Testing Guide

## System Overview

This is a complete real-time Hospital Management System with role-based dashboards for Reception, Nurse, Doctor, and Pharmacy staff. All data is stored in Supabase and synced in real-time using SWR.

## Database Schema

The system uses the following tables:
- **users** - Staff accounts with roles (reception, nurse, doctor, pharmacy, admin)
- **patients** - Patient records with demographics and medical history
- **appointments** - Scheduled appointments linked to patients and doctors
- **vitals** - Patient vital signs recorded by nurses
- **consultations** - Doctor consultations with diagnosis and treatment plans
- **prescriptions** - Medications prescribed by doctors
- **pharmacy_inventory** - Medication inventory with stock levels
- **complaints** - Patient complaints and issues
- **queue** - Real-time queue management for different departments

All tables have Row Level Security (RLS) enabled to ensure data privacy based on user roles.

## API Routes

### Patients API (`/api/patients`)
- **GET** - Fetch all patients or filter by phone/patientId
- **POST** - Create new patient record

### Vitals API (`/api/vitals`)
- **GET** - Fetch vitals for a patient (filter by patientId)
- **POST** - Record new vital signs

### Prescriptions API (`/api/prescriptions`)
- **GET** - Fetch prescriptions (filter by patientId)
- **POST** - Create new prescription
- **PATCH** - Update prescription status (pending → dispensed → cancelled)

### Appointments API (`/api/appointments`)
- **GET** - Fetch appointments (filter by patientId)
- **POST** - Schedule new appointment
- **PATCH** - Update appointment status

### Queue API (`/api/queue`)
- **GET** - Fetch queue items (filter by queueType)
- **POST** - Add patient to queue
- **PATCH** - Update queue status

### Consultations API (`/api/consultations`)
- **GET** - Fetch consultations (filter by patientId)
- **POST** - Create new consultation
- **PATCH** - Update consultation status

### Inventory API (`/api/inventory`)
- **GET** - Fetch all inventory items
- **POST** - Add medication to inventory
- **PUT** - Update inventory quantity

## Testing Workflow

### 1. Reception Dashboard Testing

**Patient Registration:**
1. Navigate to Reception Dashboard → Patient Registration tab
2. Fill in patient details (name, DOB, phone, email, etc.)
3. Click "Register Patient"
4. Verify patient appears in the system with auto-generated patient ID

**View Patient:**
1. Go to View Patient tab
2. Search by phone number or patient ID
3. Verify patient details display correctly
4. Check that all patient information is retrieved from database

**Appointment Scheduling:**
1. Go to Appointment Scheduler tab
2. Enter patient ID, date, time, and reason
3. Click "Schedule Appointment"
4. Verify appointment appears in the list
5. Check that appointment is stored in database

### 2. Nurse Dashboard Testing

**Vitals Recording:**
1. Navigate to Nurse Dashboard
2. Enter patient ID
3. Record vital signs (temperature, BP, heart rate, O2 saturation, etc.)
4. Click "Record Vitals"
5. Verify vitals are saved and displayed in patient history
6. Check for anomaly detection alerts (e.g., high BP, low O2)

**Patient History:**
1. Search for a patient by ID
2. Verify all recorded vitals appear in chronological order
3. Check that vital signs are correctly formatted

### 3. Doctor Dashboard Testing

**Patient History:**
1. Navigate to Doctor Dashboard
2. Search for patient by ID
3. Verify all vitals recorded by nurses appear
4. Check previous consultations display correctly

**Write Prescription:**
1. Select a patient
2. Enter medication details (name, dosage, frequency, quantity)
3. Click "Write Prescription"
4. Verify prescription appears in the system
5. Check that prescription is linked to patient and doctor

### 4. Pharmacy Dashboard Testing

**Prescription Fulfillment:**
1. Navigate to Pharmacy Dashboard → Prescription Fulfillment
2. Verify pending prescriptions from doctors appear
3. Select a prescription and change status to "Dispensed"
4. Verify status updates in real-time
5. Check that dispensed prescriptions no longer appear in pending list

**Inventory Management:**
1. Go to Inventory Management tab
2. Add new medication with quantity and reorder level
3. Verify medication appears in inventory list
4. Check low-stock alerts for items below reorder level
5. Update medication quantity and verify changes persist

## Real-time Data Sync Testing

### SWR Refresh Intervals
- Prescriptions: 2 seconds
- Inventory: 3 seconds
- Appointments: 3 seconds
- Queue: 2 seconds
- Vitals: 2 seconds

### Testing Real-time Updates
1. Open two browser windows with different dashboards
2. Create a patient in Reception dashboard
3. Verify patient appears in Nurse dashboard within 2-3 seconds
4. Record vitals in Nurse dashboard
5. Verify vitals appear in Doctor dashboard in real-time
6. Write prescription in Doctor dashboard
7. Verify prescription appears in Pharmacy dashboard immediately

## Authentication Testing

1. Login with reception role
2. Verify only reception dashboard is accessible
3. Logout and login with nurse role
4. Verify only nurse dashboard is accessible
5. Repeat for doctor and pharmacy roles
6. Verify RLS policies prevent unauthorized data access

## Data Integrity Testing

1. Create a patient and record vitals
2. Verify patient ID is consistent across all tables
3. Create appointment for patient
4. Verify appointment links correctly to patient
5. Write prescription for patient
6. Verify prescription links to patient and doctor
7. Check that deleting a patient cascades correctly (if applicable)

## Performance Testing

1. Load dashboard with 100+ patients
2. Verify search functionality remains responsive
3. Check that real-time updates don't cause lag
4. Monitor network requests in browser DevTools
5. Verify SWR caching is working (repeated requests use cache)

## Error Handling Testing

1. Try to create patient with invalid data
2. Verify error message displays
3. Try to record vitals with missing required fields
4. Verify form validation works
5. Simulate network error and verify graceful error handling
6. Check that error messages are user-friendly

## Deployment Checklist

- [ ] Database schema created in Supabase
- [ ] Seed data inserted (test patients and medications)
- [ ] Environment variables configured (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
- [ ] RLS policies enabled on all tables
- [ ] Authentication configured in Supabase
- [ ] All API routes tested and working
- [ ] Real-time sync verified across dashboards
- [ ] Error handling tested
- [ ] Performance verified with test data
- [ ] Deployed to Vercel

## Troubleshooting

### Data not appearing in dashboard
1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Check RLS policies allow user role to access data
4. Verify environment variables are set correctly

### Real-time updates not working
1. Check SWR refresh intervals in component
2. Verify API route is returning correct data
3. Check browser console for fetch errors
4. Verify Supabase connection is active

### Authentication issues
1. Check that user is logged in
2. Verify user role is set correctly in users table
3. Check RLS policies for the table being accessed
4. Verify JWT token is valid

## Next Steps

1. Run database migration scripts in Supabase
2. Create test user accounts for each role
3. Follow the testing workflow above
4. Deploy to Vercel
5. Monitor logs for any issues
