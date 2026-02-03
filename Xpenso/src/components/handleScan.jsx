// import Tesseract from "tesseract.js";

// // Main entry
// export const handleScan = async (videoEl) => {
//     const rawCanvas = captureFrame(videoEl);
//     const processedCanvas = processWithOpenCV(rawCanvas);
//     // const text = await scanReceipt(processedCanvas);
//     const receipt = await scanReceipt(processedCanvas);   //extractReceipt(text);

//     saveReceiptToWeek(receipt);
// };

// // Camera capture
// const captureFrame = (video) => {
//     const canvas = document.createElement("canvas");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext("2d").drawImage(video, 0, 0);

//     return canvas;
// };

// const processWithOpenCV = (canvas) => {
//     if (!window.cv) {
//         console.warn("OpenCV not loaded");
//         return canvas;
//     }

//     const src = cv.imread(canvas);
//     const gray = new cv.Mat();
//     const blurred = new cv.Mat();
//     const edged = new cv.Mat();
//     const dst = new cv.Mat();

//     cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
//     cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
//     cv.Canny(blurred, edged, 75, 200);

//     cv.cvtColor(edged, dst, cv.COLOR_GRAY2RGBA);

//     cv.imshow(canvas, dst);

//     src.delete();
//     gray.delete();
//     blurred.delete();
//     edged.delete();
//     dst.delete();

//     return canvas;
// };

// const scanReceipt = async (imageSource) => {
//     // 1️⃣ OCR
//     const { data } = await Tesseract.recognize(imageSource, "eng", {
//         tessedit_pageseg_mode: Tesseract.PSM.AUTO
//     });

//     const rawText = data.text || "";

//     // Normalize text
//     const lines = rawText
//         .split("\n")
//         .map(l => l.trim())
//         .filter(Boolean);

//     // 2️⃣ SHOP NAME (top of receipt)
//     const topLines = lines.slice(0, 7);

//     const shopName =
//         topLines.find(l =>
//             !/\d/.test(l) &&
//             l.length > 3 &&
//             !/gst|phone|order|invoice|bill|tax/i.test(l)
//         ) || null;

//     // 3️⃣ AMOUNT — try keyword first
//     const keywordRegex =
//         /(grand total|total payable|amount payable|total)[^\d]{0,10}([\d,.]+)/i;

//     let amount = null;
//     const keywordMatch = rawText.match(keywordRegex);

//     if (keywordMatch) {
//         amount = parseFloat(keywordMatch[2].replace(/,/g, ""));
//     }

//     // 4️⃣ AMOUNT fallback — largest number near bottom
//     if (!amount) {
//         const bottomLines = lines.slice(-15);

//         const numbers = bottomLines
//             .flatMap(l => l.match(/\d+\.\d{2}/g) || [])
//             .map(n => parseFloat(n));

//         if (numbers.length) {
//             amount = Math.max(...numbers);
//         }
//     }

//     // 5️⃣ Final safety cleanup
//     if (!isFinite(amount)) amount = null;

//     return {
//         details: shopName,
//         amount
//     };
// }

// const today = new Date();
// const day = today.getDate().toString().padStart(2, '0');
// const month = (today.getMonth() + 1).toString().padStart(2, '0');
// const year = today.getFullYear();

// const date = `${day}-${month}-${year}`;
// const time = new Date().toLocaleTimeString();

// const saveReceiptToWeek = (receipt) => {

//     const transaction = {
//         id: Date.now(),
//         transType: "expense",
//         date,
//         time,
//         ...receipt
//     };

//     // ✅ Always read from localStorage
//     const existing =
//         JSON.parse(localStorage.getItem("transactions")) || [];

//     const updated = [...existing, transaction];

//     localStorage.setItem("transactions", JSON.stringify(updated));
// }
import Tesseract from "tesseract.js";

/**
 * MAIN ENTRY
 * Call this from your Scan button
 */
export const handleScan = async (videoEl) => {
    try {
        if (!videoEl) throw new Error("Video element not found");

        // 1️⃣ Capture frame from camera
        const rawCanvas = captureFrame(videoEl);

        // 2️⃣ Preprocess image (optional but recommended)
        const processedCanvas = processWithOpenCV(rawCanvas);

        // 3️⃣ OCR + extract data
        const receipt = await scanReceipt(processedCanvas);

        // 4️⃣ Save to storage
        saveReceiptToWeek(receipt);

        return receipt;
    } catch (err) {
        console.error("handleScan error:", err);
        alert("Failed to scan receipt. Please try again.");
        return null;
    }
};

/**
 * Capture a single frame from <video>
 */
const captureFrame = (video) => {
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas;
};

/**
 * OCR-friendly OpenCV preprocessing
 * (grayscale + adaptive threshold)
 */
const processWithOpenCV = (canvas) => {
    if (!window.cv) {
        console.warn("OpenCV not loaded, skipping preprocessing");
        return canvas;
    }

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const thresh = new cv.Mat();

    // Convert to grayscale
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // Improve contrast for OCR
    cv.adaptiveThreshold(
        gray,
        thresh,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        11,
        2
    );

    cv.imshow(canvas, thresh);

    src.delete();
    gray.delete();
    thresh.delete();

    return canvas;
};

/**
 * OCR + rule-based extraction
 * Returns ONLY:
 * - details (shop name)
 * - amount (grand total)
 */
const scanReceipt = async (imageSource) => {
    const { data } = await Tesseract.recognize(imageSource, "eng", {
        tessedit_pageseg_mode: Tesseract.PSM.AUTO
    });

    const rawText = data.text || "";

    const lines = rawText
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    // 🏪 SHOP NAME (top of receipt)
    const shopName =
        lines.slice(0, 7).find(l =>
            !/\d/.test(l) &&
            l.length > 3 &&
            !/gst|phone|order|invoice|bill|tax/i.test(l)
        ) || null;

    // 💰 AMOUNT — keyword first
    const keywordMatch = rawText.match(
        /(grand total|total payable|amount payable|total)[^\d]{0,10}([\d,.]+)/i
    );

    let amount = keywordMatch
        ? parseFloat(keywordMatch[2].replace(/,/g, ""))
        : null;

    // 💰 Fallback — largest number near bottom
    if (!amount) {
        const numbers = lines
            .slice(-15)
            .flatMap(l => l.match(/\d+\.\d{2}/g) || [])
            .map(Number);

        if (numbers.length) {
            amount = Math.max(...numbers);
        }
    }

    if (!isFinite(amount)) amount = null;

    return {
        details: shopName,
        amount
    };
};

/**
 * Save transaction to localStorage
 * (date & time generated at save-time)
 */
const saveReceiptToWeek = (receipt) => {
    const now = new Date();

    const transaction = {
        id: Date.now(),
        transType: "expense",
        date: now.toLocaleDateString("en-GB"),
        time: now.toLocaleTimeString(),
        ...receipt
    };

    const existing =
        JSON.parse(localStorage.getItem("transactions")) || [];

    const updated = [...existing, transaction];

    localStorage.setItem("transactions", JSON.stringify(updated));
};
