// backend/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./credenciais-firebase.json'); // você deve baixar esse JSON no Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
