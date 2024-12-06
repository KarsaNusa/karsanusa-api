const Forum = require('../models/forumModel');

// Fungsi untuk mendapatkan semua postingan forum
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Forum.find();
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Fungsi untuk menambahkan postingan baru ke forum
exports.addPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId; // User ID dari token JWT

    try {
        const newPost = new Forum({ title, content, userId });
        await newPost.save();
        res.status(201).json({ message: 'Post added successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
