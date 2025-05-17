import mongoose, { Schema, Document } from 'mongoose';

interface Appointment {
    time: string;
    issue: string;
}

export interface DoctorDocument extends Document {
    docId: string;
    docName: string;
    image: string;
    speciality: string;
    price: number;
    appointments: Map<string, Appointment[]>;
}

const DoctorSchema = new Schema<DoctorDocument>({
    docId: { type: String, required: true, unique: true },
    docName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    speciality: { type: String, required: true },
    appointments: {
        type: Map,
        of: [
            {
                time: { type: String, required: true },
                issue: { type: String, required: true }
            }
        ],
        default: {},
    },
});

export default mongoose.model<DoctorDocument>('Doctor', DoctorSchema);
