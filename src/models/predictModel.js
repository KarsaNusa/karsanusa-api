const tf = require('@tensorflow/tfjs');

// Load model
async function loadModel() {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/ml-models-karsanusa/best_model.h5'); // Path ke model.json
    console.log('Model berhasil dimuat');
    return model;
}

// Prediksi dengan model
async function predict(inputData) {
    const model = await loadModel();

    // Pastikan inputData memiliki bentuk yang sama dengan input model
    const tensorInput = tf.tensor(inputData);

    const prediction = model.predict(tensorInput);
    prediction.print(); // Tampilkan hasil prediksi
}

// Contoh data input
const inputData = [[1, 2, 3, 4]]; // Ganti dengan input sesuai model
predict(inputData);