import express from 'express';
import multer from 'multer';
const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
});

// POST /api/upload - Upload single image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // For now, just return a placeholder response
    // In production, this would upload to Cloudinary
    res.json({
      success: true,
      message: 'Upload endpoint working',
      data: {
        url: 'https://via.placeholder.com/300x300',
        publicId: 'placeholder_' + Date.now()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
});

export default router;