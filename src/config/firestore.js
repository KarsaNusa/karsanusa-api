const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

// Ambil kredensial dari environment variable
const serviceAccountPath = process.env.FIRESTORE_KEY_PATH;
const projectId = process.env.GCP_PROJECT_ID;

if (!serviceAccountPath || !projectId) {
  throw new Error('Kredensial atau ID proyek tidak ditemukan');
}

const firestore = new Firestore({
  projectId,
  keyFilename: path.resolve(serviceAccountPath),
});

module.exports = firestore;
