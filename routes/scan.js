const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const Scan = require('../models/Scan');
const { authMiddleware } = require('./auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Upload Scan Route
router.post('/upload', authMiddleware, upload.single('scan'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `scans/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    try {
        const s3Upload = await s3.upload(params).promise();
        const newScan = new Scan({ userId: req.user.id, scanUrl: s3Upload.Location });
        await newScan.save();
        res.json({ message: "Scan uploaded", scanUrl: s3Upload.Location });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router };
