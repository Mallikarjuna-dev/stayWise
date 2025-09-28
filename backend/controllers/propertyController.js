const { validationResult } = require('express-validator');
const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const payload = req.body;
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
