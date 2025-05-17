import express, { Request, Response } from 'express';
import Doctor from '../models/Doctors';

const router = express.Router();

// GET all doctors
router.get('/', async (_req: Request, res: Response) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// To update doctor's appointment
router.post(
    '/:docId/appointments',
    async (
        req: Request<{ docId: string }, {}, { date: string; time: string; issue: string }>,
        res: Response
    ): Promise<any> => {
        const { docId } = req.params;
        const { date, time, issue } = req.body;

        if (!date || !time || !issue) {
            return res.status(400).json({ error: 'Missing date, time, or issue' });
        }

        try {
            const doctor = await Doctor.findOne({ docId });

            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            const existingAppointments = doctor.appointments.get(date) || [];

            //Check if the time slot is already taken
            const isTaken = existingAppointments.some(app => app.time === time);
            if (isTaken) {
                return res.status(400).json({ error: 'Time slot already booked' });
            }

            existingAppointments.push({ time, issue });

            doctor.appointments.set(date, existingAppointments);
            await doctor.save();

            return res.status(200).json(doctor);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to update appointment' });
        }
    }
);


// To add new doctors
router.post('/addDoctors', async (req: Request, res: Response) => {
    try {
        const doctors = req.body;

        if (!Array.isArray(doctors) || doctors.length === 0) {
            res.status(400).json({ error: 'Request body should be a non-empty array of doctors' });
        }
        
        const newDoctors = await Doctor.insertMany(doctors);
        res.status(200).json(newDoctors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create doctor' });
    }
});


export default router;