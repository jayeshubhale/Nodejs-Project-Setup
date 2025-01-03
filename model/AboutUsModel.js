const mongoose = require('mongoose');

const AboutUsSchema = new mongoose.Schema({
    AboutUsInfo: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('AboutUsModel', AboutUsSchema);


