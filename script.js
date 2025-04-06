const canvas = document.querySelector("#meme");
const form = document.getElementById("myForm");
const inputField = document.getElementById("userInput");
const loading = document.getElementById("loading");
const topTextInput = document.getElementById("top-caption");
const bottomTextInput = document.getElementById("bottom-caption");
import { GoogleGenAI } from 'https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm';

let image = new Image();

// Initialize AI model
const ai = new GoogleGenAI({
    apiKey: "AIzaSyD3U_iIFMJJWM4w0Sx6HMKHg1IghtGUYN8"
});

const imageLibrary = [
    './images_library/cat_mouth_img.png',
    './images_library/cats+liquid+2.jpg',
    './images_library/Cool-cat-meme-2.jpg',
    './images_library/loading-cat.gif',
    './images_library/math cat.jpg',
    './images_library/melted12_4e189508-0c43-406c-a76a-d6f05053163f.jpg',
    './images_library/standing cat.png',
    './images_library/table_cat.jpeg',
    './images_library/98e24af569e8f8dfb4391dbac0accb10_9edaab163f5e46e04be6a7ecb1dda7ae.webp',
    './images_library/Screen_Shot_2024-03-15_at_10.53.41_AM.webp'
];

// Function to get a random image from the library
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageLibrary.length);
    return imageLibrary[randomIndex];
}

// Handle meme generation form submission
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const input = inputField.value.trim();
    if (!input) return;  // Don't proceed if input is empty

    loading.style.display = "block";
    topTextInput.textContent = "";
    bottomTextInput.textContent = "";

    image.src = getRandomImage(); // Get a random image
    console.log(image.src);
    
    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash-001',
            contents: [{
                role: "user",
                parts: [{
                    text: `Also, there must be NO cuss words. Your response should not be inappropriate. I have a cat meme image. I need you to generate a short caption for that. For context, I am a student so it should be study related. I have an image already, do not generate a new image. Your response should only be the words of text, do not include any other words or characters around it. This is what it should be based on: ${input}`
                }]
            }]
        });
     
     
        const caption = result.candidates?.[0]?.content?.parts?.[0]?.text;
     
    
        if (caption) {
            // Split caption into top and bottom text
            const middleIndex = Math.floor(caption.length / 2);
            let splitIndex = caption.lastIndexOf(' ', middleIndex);
            if (splitIndex === -1) splitIndex = middleIndex;

            topTextInput.textContent = caption.slice(0, splitIndex).trim();
            bottomTextInput.textContent = caption.slice(splitIndex).trim();

            // Update meme canvas
            updateMemeCanvas(canvas, image, topTextInput.textContent, bottomTextInput.textContent);
            enableDownload();
            saveMeme(); // Save meme to library
        } else {
            topTextInput.textContent = "No caption generated.";
        }
    } catch (err) {
        console.error("Error generating content:", err);
        topTextInput.textContent = "Error generating meme.";
    } finally {
        loading.style.display = "none";
    }
});

// Generate the meme image with captions
function updateMemeCanvas(canvas, image, topText, bottomText) {
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    const fontSize = Math.floor(width / 17);
    const yOffset = height / 25;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);

    // Add text to canvas
    ctx.strokeStyle = "black";
    ctx.lineWidth = Math.floor(fontSize / 4);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.font = `${fontSize}px sans-serif`;

    ctx.textBaseline = "top";
    ctx.strokeText(topText, width / 2, yOffset);
    ctx.fillText(topText, width / 2, yOffset);

    ctx.textBaseline = "bottom";
    ctx.strokeText(bottomText, width / 2, height - yOffset);
    ctx.fillText(bottomText, width / 2, height - yOffset);
};

const downloadBtn = document.getElementById("downloadBtn");

function enableDownload() {
    downloadBtn.style.display = "inline-block"; // Show the button
    downloadBtn.onclick = function () {
        const link = document.createElement("a");
        link.download = "meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
};

// Save meme to library
function saveMeme() {
    const memeImage = canvas.toDataURL("image/png");

    const memeButton = document.createElement("button");
    memeButton.classList.add("saved-image");
    memeButton.style.backgroundImage = `url(${memeImage})`;
    memeButton.style.backgroundSize = "cover";

    memeButton.onclick = () => openSavedMeme(memeImage);

    document.getElementById("savedImages").appendChild(memeButton);
};

// Open meme from sidebar
function openSavedMeme(memeImage) {
    const newWindow = window.open();
    newWindow.document.write(`<img src="${memeImage}" style="width: 100%; height: auto;" />`);
};

document.getElementById("openLibraryBtn").addEventListener("click", function () {
    const sidebar = document.getElementById("savedMemesSidebar");
    // Toggle visibility of the sidebar
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block"; 
});

// Handle closing the sidebar
document.getElementById("closeSidebarBtn").addEventListener("click", function () {
    const sidebar = document.getElementById("savedMemesSidebar");
    sidebar.style.display = "none"; // Hide the sidebar
});