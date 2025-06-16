import Appointment from '../models/Appointment.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time } = req.body;

    const newAppointment = await Appointment.create({
      user: req.user._id,
      doctor,
      date,
      time
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error booking appointment' });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching appointments' });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching all appointments' });
  }
};
