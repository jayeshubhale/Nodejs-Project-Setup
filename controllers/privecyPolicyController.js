const PrivecyPolicy = require('../model/privecyPolicyModel');
const AboutUsModel = require('../model/AboutUsModel');




const updatePrivacyPolicy = async function (req, res) {
    try {
        let privacyPolicy = await PrivecyPolicy.findOne({});
        if (req.body === undefined) {
            return res.status(400).send({
                error_code: 400,
                message: 'Empty request body. Please provide the required data.'
            });
        }
        let obj = {
            description: req.body.description || undefined
        };

        console.log('obj', obj);

        if (!privacyPolicy) {
            await PrivecyPolicy.create(obj);
            return res.status(200).send({
                error_code: 200,
                message: 'Privacy policy created successfully.'
            });
        } else {
            privacyPolicy.description = req.body.description;
            await privacyPolicy.save();
            return res.status(200).send({
                error_code: 200,
                message: 'Privacy policy updated successfully.'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error_code: 500,
            message: 'Internal Server Error: Failed to update privacy policy.'
        });
    }
};


// ================================================================ 


const getPrivecyPolicy = async (req, res) => {
    try {
        const privecypolicy = await PrivecyPolicy.findOne({});
        if (!privecypolicy) {
            return res.status(404).json({
                error_code: 404,
                message: 'Privacy policy not found.'
            });
        }
        return res.status(200).json({
            error_code: 200,
            message: 'Privacy policy retrieved successfully.',
            data: privecypolicy
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error_code: 500,
            message: 'Error inside getPrivecyPolicy api in PrivecyPolicy controller.'
        });
    }
};


// ================================================================ 


// PUT API to create or update About Us
const updateAboutUs = async (req, res) => {
    try {

        const { AboutUsInfo } = req.body;


        if (!req.body || !req.body.AboutUsInfo) {
            return res.status(400).send({
                error_code: 400,
                message: 'AboutUsInfo is required in the request body.'
            });
        }


        // Check if the About Us document already exists
        let aboutUs = await AboutUsModel.findOne({});

        if (!aboutUs) {
            // Create a new About Us document if it doesn't exist
            aboutUs = new AboutUsModel({ AboutUsInfo });
            await aboutUs.save();

            return res.status(201).send({
                error_code: 201,
                message: 'About Us created successfully.',
                data: aboutUs
            });
        }

        // Update the existing About Us document
        aboutUs.AboutUsInfo = AboutUsInfo;
        await aboutUs.save();

        return res.status(200).send({
            error_code: 200,
            message: 'About Us updated successfully.',
            data: aboutUs
        });
    } catch (error) {
        console.error('Error updating About Us:', error);
        return res.status(500).send({
            error_code: 500,
            message: 'Internal Server Error: Failed to update About Us.'
        });
    }
};

// GET API to retrieve About Us
const getAboutUs = async (req, res) => {
    try {
        const aboutUs = await AboutUsModel.findOne({});

        if (!aboutUs) {
            return res.status(404).send({
                error_code: 404,
                message: 'About Us information not found.'
            });
        }

        return res.status(200).send({
            error_code: 200,
            message: 'About Us retrieved successfully.',
            data: aboutUs
        });
    } catch (error) {
        console.error('Error fetching About Us:', error);
        return res.status(500).send({
            error_code: 500,
            message: 'Internal Server Error: Failed to fetch About Us.'
        });
    }
};



module.exports = {
    updatePrivacyPolicy: updatePrivacyPolicy,
    getPrivecyPolicy: getPrivecyPolicy,
    updateAboutUs,
    getAboutUs,
}


