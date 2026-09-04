// js/canvas.js

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentStroke = null;

let tool = "brush";
let color = "#ff4d6d";
let brushSize = 5;


// ========================================
// CANVAS RESIZE
// ========================================

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
}

window.addEventListener("resize", resizeCanvas);


// ========================================
// GET POINTER POSITION
// ========================================

function getPosition(event) {

    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}


// ========================================
// START DRAWING
// ========================================

canvas.addEventListener("pointerdown", event => {

    drawing = true;

    const pos = getPosition(event);

    currentStroke = {
        color: tool === "eraser"
            ? "#ffffff"
            : color,

        size: tool === "eraser"
            ? brushSize * 3
            : brushSize,

        points: [
            pos
        ]
    };

    canvas.setPointerCapture(event.pointerId);

    drawStroke(currentStroke);

});


// ========================================
// DRAW
// ========================================

canvas.addEventListener("pointermove", event => {

    if (!drawing || !currentStroke) {
        return;
    }

    const pos = getPosition(event);

    currentStroke.points.push(pos);

    drawStroke(currentStroke);

});


// ========================================
// STOP DRAWING
// ========================================

canvas.addEventListener("pointerup", finishStroke);

canvas.addEventListener(
    "pointercancel",
    finishStroke
);


async function finishStroke() {

    if (!drawing || !currentStroke) {
        return;
    }

    drawing = false;

    const stroke =
        currentStroke;

    currentStroke = null;

    // Save stroke to Firebase
    try {

        await saveStroke(stroke);

    } catch (error) {

        console.error(
            "Stroke save error:",
            error
        );

    }

}


// ========================================
// DRAW SINGLE STROKE
// ========================================

function drawStroke(stroke) {

    const points = stroke.points;

    if (!points || points.length === 0) {
        return;
    }

    ctx.save();

    ctx.strokeStyle =
        stroke.color;

    ctx.lineWidth =
        stroke.size;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    // Single point
    if (points.length === 1) {

        ctx.arc(
            points[0].x,
            points[0].y,
            stroke.size / 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            stroke.color;

        ctx.fill();

    } else {

        ctx.moveTo(
            points[0].x,
            points[0].y
        );

        for (
            let i = 1;
            i < points.length;
            i++
        ) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );

        }

        ctx.stroke();

    }

    ctx.restore();

}


// ========================================
// REDRAW ALL FIREBASE STROKES
// ========================================

function redrawAllStrokes(strokes) {

    ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );

    Object.keys(strokes || {})
        .forEach(strokeId => {

            const stroke =
                strokes[strokeId];

            drawStroke(stroke);

        });

}


// ========================================
// COLOR PICKER
// ========================================

document
    .getElementById("colorPicker")
    .addEventListener("input", event => {

        color =
            event.target.value;

        tool = "brush";

        updateTools();

    });


// ========================================
// BRUSH SIZE
// ========================================

document
    .getElementById("brushSize")
    .addEventListener("input", event => {

        brushSize =
            Number(event.target.value);

    });


// ========================================
// BRUSH / ERASER
// ========================================

document
    .querySelectorAll(".tool[data-tool]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                tool =
                    button.dataset.tool;

                updateTools();

            }
        );

    });


function updateTools() {

    document
        .querySelectorAll(".tool[data-tool]")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tool === tool
            );

        });

}


// ========================================
// CLEAR CANVAS
// ========================================

document
    .getElementById("clearBtn")
    .addEventListener("click", async () => {

        if (!confirm(
            "Clear the entire canvas?"
        )) {

            return;
        }

        // আপাতত local clear
        ctx.clearRect(
            0,
            0,
            canvas.clientWidth,
            canvas.clientHeight
        );

    });


// ========================================
// UNDO
// ========================================

document
    .getElementById("undoBtn")
    .addEventListener("click", () => {

        alert(
            "Undo will be added with realtime sync."
        );

    });