"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Doctors_1 = __importDefault(require("../models/Doctors"));
const router = express_1.default.Router();
// GET all doctors
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield Doctors_1.default.find();
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
}));
// POST to update a doctor's appointment
router.post('/:docId/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { docId } = req.params;
    const { date, time, issue } = req.body;
    if (!date || !time || !issue) {
        return res.status(400).json({ error: 'Missing date, time, or issue' });
    }
    try {
        const doctor = yield Doctors_1.default.findOne({ docId });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        //   appointments is a Map, so use .set
        //   doctor.appointments.set(date, { time, issue });
        yield doctor.save();
        return res.status(200).json(doctor);
    }
    catch (err) {
        return res.status(500).json({ error: 'Failed to update appointment' });
    }
}));
exports.default = router;
