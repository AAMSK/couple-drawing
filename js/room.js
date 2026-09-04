// js/room.js

import { db } from "./firebase.js";

import {
 ref,
 set,
 get,
 push,
 remove,
 onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


let currentRoom = null;
let myUserId = null;


// Generate random user ID
function generateUserId() {
 
 return "user_" +
  Math.random()
  .toString(36)
  .substring(2, 10);
}


// Generate room code
function generateRoomCode() {
 
 const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
 
 let code = "";
 
 for (let i = 0; i < 6; i++) {
  
  code += chars[
   Math.floor(Math.random() * chars.length)
  ];
 }
 
 return code;
}


// Create Room
async function createRoom() {
 
 currentRoom = generateRoomCode();
 
 myUserId = generateUserId();
 
 const roomRef =
  ref(db, `rooms/${currentRoom}`);
 
 await set(roomRef, {
  
  createdAt: Date.now(),
  
  users: {
   [myUserId]: {
    online: true,
    joinedAt: Date.now()
   }
  }
  
 });
 
 document.getElementById("roomCode")
  .textContent = currentRoom;
}


// Join Room
async function joinRoom(room) {
 
 room = room.toUpperCase();
 
 const roomRef =
  ref(db, `rooms/${room}`);
 
 const snapshot = await get(roomRef);
 
 if (!snapshot.exists()) {
  
  alert("Room not found.");
  
  return false;
 }
 
 const data = snapshot.val();
 
 const users =
  data.users || {};
 
 const userCount =
  Object.keys(users).length;
 
 if (userCount >= 2) {
  
  alert("Room is full ❤️");
  
  return false;
 }
 
 currentRoom = room;
 
 myUserId = generateUserId();
 
 await set(
  ref(db, `rooms/${room}/users/${myUserId}`),
  {
   online: true,
   joinedAt: Date.now()
  }
 );
 
 return true;
}


// Open drawing
async function openDrawing(room) {
 
 let success = false;
 
 if (myUserId) {
  
  success = true;
  
 } else {
  
  success = await joinRoom(room);
 }
 
 if (!success) return;
 
 document.getElementById("activeRoom")
  .textContent = currentRoom;
 
 showScreen("drawingScreen");
 
 setTimeout(() => {
  
  resizeCanvas();
  
  listenToStrokes();
  
 }, 100);
}


// Add stroke to Firebase
async function saveStroke(stroke) {
 
 if (!currentRoom) return;
 
 const strokesRef =
  ref(db, `rooms/${currentRoom}/strokes`);
 
 const newStroke =
  push(strokesRef);
 
 await set(newStroke, {
  
  userId: myUserId,
  
  color: stroke.color,
  
  size: stroke.size,
  
  points: stroke.points,
  
  timestamp: Date.now()
  
 });
}


// Delete stroke
async function deleteStroke(strokeId) {
 
 if (!currentRoom) return;
 
 await remove(
  ref(
   db,
   `rooms/${currentRoom}/strokes/${strokeId}`
  )
 );
}


// Listen for realtime strokes
function listenToStrokes() {
 
 if (!currentRoom) return;
 
 const strokesRef =
  ref(db, `rooms/${currentRoom}/strokes`);
 
 onValue(strokesRef, snapshot => {
  
  const data =
   snapshot.val() || {};
  
  redrawAllStrokes(data);
  
 });
}


// Export
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.openDrawing = openDrawing;
window.saveStroke = saveStroke;
window.deleteStroke = deleteStroke;

window.getCurrentRoom = () =>
 currentRoom;

window.getMyUserId = () =>
 myUserId;