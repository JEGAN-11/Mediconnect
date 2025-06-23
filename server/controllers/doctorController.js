import Doctor from '../models/Doctor.js';

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating doctor' });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctors' });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating doctor' });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });

    res.json({ msg: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting doctor' });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { _id: req.user.id },
      {
        experience: req.body.experience,
        availability: req.body.availability,
      },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ msg: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating doctor profile' });
  }
};
