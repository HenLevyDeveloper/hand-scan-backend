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


// Body Parts
router.get('/body-parts', (req, res) => {
    res.json([
    {
        "id": "1",
        "name": "Wrist",
        "image": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Nadgarstek_%28ubt%29.jpeg"
    },
    {
        "id": "2",
        "name": "Thumb",
        "image": "https://www.publicdomainpictures.net/pictures/180000/velka/hand-with-thumb-up.jpg"
    },
    {
        "id": "3",
        "name": "Forearm",
        "image": "https://paincareclinic.co.uk/wp-content/uploads/2023/08/forearm.png"
    },
    {
        "id": "4",
        "name": "Elbow",
        "image": "https://excelsportspt.com/wp-content/uploads/2020/03/shutterstock_1523898098.jpg"
    },
    {
        "id": "5",
        "name": "Hand",
        "image": "https://i.pinimg.com/736x/16/3b/a5/163ba5058014b2b8aada92fc10947301.jpg"
    },
    {
        "id": "6",
        "name": "Ankle",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/74/Ankle.jpg"
    },
    {
        "id": "7",
        "name": "Foot",
        "image": "https://www.thechelseaclinic.uk/wp-content/uploads/2022/08/foot-drop-729x1024.jpg"
    },
    {
        "id": "8",
        "name": "Lower Leg",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy112VzyzeN4Tf_-8znz_uX6VzKEM8v6o58w&s"
    },
    {
        "id": "9",
        "name": "Knee",
        "image": "https://www.londonbridgeorthopaedics.co.uk/wp-content/uploads/2024/06/knee.jpg"
    }
]);
});

module.exports = { router };
