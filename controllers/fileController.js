
const multer = require('multer');
const path = require('path');
const File = require('../models/fileModel.js');
const { v4: uuid4 } = require('uuid');
const sendMail = require('../services/emailService.js');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 100 },
}).single('myFile');

exports.uploadFile = (req, res) => {

    // Store file
    upload(req, res, async (err) => {
        // Validate request
        if (!req.file) {
            return res.json({ error: 'All Fields are Required' });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        } else {
            // Store into database
            const file = new File({
                filename: req.file.filename,
                uuid: uuid4(),
                path: req.file.path,
                size: req.file.size
            });

            const response = await file.save();

            // Response -> Link
            return res.json({ file: `${process.env.APP_BASE_URL}files/${response.uuid}` });

        }
    });

}

exports.sendMail = async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    // Validate
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All Fields are required' });
    } else {
        // Get Data From DB
        const file = await File.findOne({ uuid: uuid });
        if (file.sender) {
            return res.status(422).send({ error: 'Email Already sent' });
        }

        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // Send Email
        sendMail({
            from: emailFrom,
            to: emailTo,
            subject: "adShare - File Sharing Site",
            text: `${emailFrom} shared a file with you`,
            html: require('../services/emailTemplate.js')({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}files/${file.uuid}`,
                size: parseInt(file.size / 1000) + 'KB',
                expires: '24 hours'
            })
        });

        return res.send({ success: true });
    }
}
