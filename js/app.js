// js/app.js

// ================================
// SCREEN MANAGEMENT
// ================================

const screens = [
 "welcomeScreen",
 "createScreen",
 "joinScreen",
 "drawingScreen"
];


function showScreen(id) {
 
 screens.forEach(screen => {
  
  const element =
   document.getElementById(screen);
  
  if (element) {
   element.classList.remove("active");
  }
  
 });
 
 const target =
  document.getElementById(id);
 
 if (target) {
  target.classList.add("active");
 }
}


// ================================
// CREATE ROOM
// ================================

document
 .getElementById("createRoomBtn")
 .addEventListener("click", async () => {
  
  try {
   
   await createRoom();
   
   showScreen("createScreen");
   
  } catch (error) {
   
   console.error(error);
   
   alert(
    "Could not create room.\n" +
    error.message
   );
   
  }
  
 });


// ================================
// JOIN ROOM SCREEN
// ================================

document
 .getElementById("joinRoomBtn")
 .addEventListener("click", () => {
  
  showScreen("joinScreen");
  
  setTimeout(() => {
   
   document
    .getElementById("roomInput")
    .focus();
   
  }, 100);
  
 });


// ================================
// START DRAWING
// ================================

document
 .getElementById("startDrawingBtn")
 .addEventListener("click", async () => {
  
  const room =
   document
   .getElementById("roomCode")
   .textContent
   .trim();
  
  if (!room || room.length !== 6) {
   
   alert("Room code is not available.");
   
   return;
  }
  
  await openDrawing(room);
  
 });


// ================================
// JOIN ROOM
// ================================

document
 .getElementById("joinConfirmBtn")
 .addEventListener("click", async () => {
  
  const input =
   document.getElementById("roomInput");
  
  const room =
   input.value
   .trim()
   .toUpperCase();
  
  if (room.length !== 6) {
   
   alert(
    "Please enter a valid 6-character room code."
   );
   
   input.focus();
   
   return;
  }
  
  const button =
   document.getElementById("joinConfirmBtn");
  
  button.disabled = true;
  button.textContent = "Joining...";
  
  try {
   
   await openDrawing(room);
   
  } catch (error) {
   
   console.error(error);
   
   alert(
    "Could not join room.\n" +
    error.message
   );
   
  } finally {
   
   button.disabled = false;
   button.textContent = "Join Room";
   
  }
  
 });


// ================================
// COPY ROOM CODE
// ================================

document
 .getElementById("copyRoomBtn")
 .addEventListener("click", async () => {
  
  const code =
   document
   .getElementById("roomCode")
   .textContent
   .trim();
  
  if (!code || code === "------") {
   
   return;
  }
  
  try {
   
   await navigator.clipboard.writeText(code);
   
   alert("Room code copied ❤️");
   
  } catch (error) {
   
   console.error(error);
   
   alert(
    "Room code: " + code
   );
   
  }
  
 });


// ================================
// ROOM INPUT
// ================================

document
 .getElementById("roomInput")
 .addEventListener("input", event => {
  
  event.target.value =
   event.target.value
   .toUpperCase()
   .replace(/[^A-Z0-9]/g, "")
   .substring(0, 6);
  
 });


// ================================
// ENTER KEY TO JOIN
// ================================

document
 .getElementById("roomInput")
 .addEventListener("keydown", event => {
  
  if (event.key === "Enter") {
   
   document
    .getElementById("joinConfirmBtn")
    .click();
   
  }
  
 });