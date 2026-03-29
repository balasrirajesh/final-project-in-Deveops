const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

// In-memory store for favorites (moved from app.js)
let favorites = [];

// GET / - Fetch songs from Jamendo API
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20`);
        const songs = response.data.results;
        res.render('index', { title: 'Music Stream', songs, favorites });
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        res.render('index', { title: 'Music Stream', songs: [], favorites: [], error: 'Failed to fetch music.' });
    }
});

// GET /favorites - Render liked songs
router.get('/favorites', (req, res) => {
    res.render('favorites', { title: 'My Favorites', songs: favorites });
});

// POST /favorite - Add/Remove from in-memory array
router.post('/favorite', (req, res) => {
    const song = req.body;
    const exists = favorites.find(s => s.id === song.id);
    
    if (exists) {
        favorites = favorites.filter(s => s.id !== song.id);
        return res.json({ success: true, action: 'removed', favorites });
    } else {
        favorites.push(song);
        return res.json({ success: true, action: 'added', favorites });
    }
});

// GET /recommendations/:artist - Fetch by artist
router.get('/recommendations/:artist', async (req, res) => {
    const artistName = req.params.artist;
    try {
        const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&artist_name=${encodeURIComponent(artistName)}&limit=10`);
        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

module.exports = router;
