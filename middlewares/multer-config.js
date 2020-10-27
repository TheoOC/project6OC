const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    //tell multer to store images in images folder
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //change name of file so there is no name conflict
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//export multer element with storage const and we tell it we only manage images
module.exports = multer({ storage }).single('image');