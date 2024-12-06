const News = require('../models/newsModel');

// Fungsi untuk mendapatkan semua berita
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find();
        res.json({ news: newsList });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fungsi untuk mendapatkan detail berita/batik berdasarkan ID
exports.getNewsDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const newsItem = await News.findById(id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ news: newsItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
