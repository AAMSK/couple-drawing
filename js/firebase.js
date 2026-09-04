// js/firebase.js

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBkVR3h_z997ub9V-e6g1h2q6bKMfKhq80",
    authDomain: "couple-drawing.firebaseapp.com",
    databaseURL: "https://couple-drawing-default-rtdb.firebaseio.com",
    projectId: "couple-drawing",
    storageBucket: "couple-drawing.firebasestorage.app",
    messagingSenderId: "482010183093",
    appId: "1:482010183093:web:b66eb8e97f9fd48e7495fc",
    measurementId: "G-BC68WY5XTD"
};


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { app, db };