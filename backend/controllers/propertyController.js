const { validationResult } = require('express-validator');
const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const payload = req.body;
    // owner can be admin id if needed
    const property = await Property.create(payload);
    res.status(201).json({ message: 'Property created', property });
};

exports.getProperties = async (req, res) => {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({ properties });
};

exports.getProperty = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ property });
};

exports.updateProperty = async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property updated', property });
};

exports.deleteProperty = async (req, res) => {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
};
