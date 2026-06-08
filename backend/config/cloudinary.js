const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const noteStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Eduflow/notes',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
   
  }
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Eduflow/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

const resourceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Eduflow/resources',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'ppt', 'pptx'],
    
  }
});

const uploadNote = multer({ storage: noteStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadProfile = multer({ storage: profileStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadResource = multer({ storage: resourceStorage, limits: { fileSize: 20 * 1024 * 1024 } });

module.exports = { cloudinary, uploadNote, uploadProfile, uploadResource };