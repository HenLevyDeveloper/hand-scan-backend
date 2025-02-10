require("dotenv").config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const Scan = require('../models/Scan');

const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Generate a pre-signed URL
router.post('/generate-presigned-url', async (req, res) => {
    const { userId, fileName } = req.body;
  
    if (!userId || !fileName) {
      return res.status(400).json({ error: "Missing userId or fileName" });
    }
  
    const key = `scans/${userId}/${Date.now()}_${fileName}`; // Unique key for the file
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 60 * 5, // URL expires in 5 minutes
      ContentType: "application/octet-stream", // For .usdz files
    };
  
    try {
      const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  
      // Save the reference to MongoDB
      const scan = new Scan({
        userId,
        key,
        url: `https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${key}`,
      });
      await scan.save();
  
      res.json({ uploadUrl, key });
    } catch (error) {
      console.error("Error generating pre-signed URL", error);
      res.status(500).json({ error: "Could not generate URL" });
    }
});

// Get all scans for a user
router.get('/scans/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
        const scans = await Scan.find({ userId });

        // Convert `_id` to `id`
        const formattedScans = scans.map(scan => ({
            id: scan._id.toString(),
            userId: scan.userId,
            key: scan.key,
            url: scan.url,
            createdAt: scan.createdAt,
        }));

        res.json(formattedScans);
    } catch (error) {
        console.error("Error fetching scans", error);
        res.status(500).json({ error: "Could not fetch scans" });
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
        "name": "Elbow",
        "image": "https://excelsportspt.com/wp-content/uploads/2020/03/shutterstock_1523898098.jpg"
        
    },
    {
        "id": "3",
        "name": "Ankle",
        "image": "https://upload.wikimedia.org/wikipedia/commons/7/74/Ankle.jpg"
        
    },
    {
        "id": "4",
        "name": "Knee",
        "image": "https://www.londonbridgeorthopaedics.co.uk/wp-content/uploads/2024/06/knee.jpg"
    },
    {
        "id": "5",
        "name": "Forearm",
        "image": "https://paincareclinic.co.uk/wp-content/uploads/2023/08/forearm.png"
    },
    {
        "id": "6",
        "name": "Thumb",
        "image": "https://www.publicdomainpictures.net/pictures/180000/velka/hand-with-thumb-up.jpg"
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
        "name": "Hand",
        "image": "https://i.pinimg.com/736x/16/3b/a5/163ba5058014b2b8aada92fc10947301.jpg"
    }
]);
});

module.exports = { router };
