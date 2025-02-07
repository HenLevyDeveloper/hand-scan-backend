const express = require('express');

const router = express.Router();

// Products Solutions
router.get('/solutions', (req, res) => {
    const solutions = [
        { 
            id: "0",
            name: "SHORT ARM CAST", 
            description: "Designed for wrist, forearm, and hand fractures. Provides reliable support and comfort",
            image: "https://gero3d.com/wp-content/uploads/2024/09/SHORT-ARM-RENDER-2.2.webp" 
        },
        { 
            id: "1",
            name: "THUMB SPICA", 
            description: "Perfect for thumb and scaphoid fractures. Ensures targeted immobilization and stability",
            image: "https://gero3d.com/wp-content/uploads/2024/09/SHORT-THUNB-RENDER-2.2.webp" 
        },
        { 
            id: "2",
            name: "HAND BASED THUMB SPICA", 
            description: "Designed to provide optimal support for CMC arthritis and trapezium fractures",
            image: "https://gero3d.com/wp-content/uploads/2024/11/SHORT-ARM-RENDER-1.117.webp" 
        }
    ];

    res.status(200).json(solutions);
});

module.exports = { router };
