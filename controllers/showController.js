
const File = require('../models/fileModel.js');

exports.showFile = async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has been Expired' });
        } else {
            return res.render('download', {
                uuid: file.uuid,
                fileName: file.filename,
                fileSize: file.size,
                downloadLink: `${process.env.APP_BASE_URL}files/download/${file.uuid}`
            })
        }
    }
    catch (err) {
        return res.render('download', { error: 'Something went wrong' });
    }
}

exports.downloadFile = async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
        return res.render('download', { error: "Link has been expired" });
    } else {
        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);
    }
}







