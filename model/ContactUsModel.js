const mongoose = require('mongoose');

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const ContactUs = mongoose.model('ContactUsModel', ContactUsSchema);

module.exports = ContactUs;
