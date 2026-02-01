// import JScanify from "jscanify";
// const JScanify = require("jscanify");
import Tesseract from "tesseract.js";

// const jscanify = new JScanify();

// Main entry
export const handleScan = async (videoEl) => {
    const rawCanvas = captureFrame(videoEl);
    // const scanned = await scanReceipt(canvas);
    const processedCanvas = processWithOpenCV(rawCanvas);
    const text = await runOCR(processedCanvas);
    const receipt = extractReceipt(text);

    saveReceiptToWeek(receipt);
};

// Camera capture
const captureFrame = (video) => {
    const canvas = document.createElement("canvas");
    // const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // ctx.drawImage(video, 0, 0);
    canvas.getContext("2d").drawImage(video, 0, 0);

    return canvas;
};

// // Scan & OCR
// const scanReceipt = async (canvas) => {
//     return await jscanify.scan(canvas);
// };

const processWithOpenCV = (canvas) => {
    if (!window.cv) {
        console.warn("OpenCV not loaded");
        return canvas;
    }

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edged = new cv.Mat();
    const dst = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edged, 75, 200);

    cv.cvtColor(edged, dst, cv.COLOR_GRAY2RGBA);

    cv.imshow(canvas, dst);

    src.delete();
    gray.delete();
    blurred.delete();
    edged.delete();
    dst.delete();

    return canvas;
};

const runOCR = async (canvas) => {
    const { data } = await Tesseract.recognize(canvas, "eng");
    return data.text;
};

// Data extraction
const extractReceipt = (text) => {
    return {
        // id: crypto.randomUUID(),
        amount:
            text.match(/₹\s?\d+(\.\d{2})?/)?.[0] ||
            text.match(/\d+\.\d{2}/)?.[0] ||
            null,

        date:
            text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] ||
            new Date().toISOString().slice(0, 10),

        time: text.match(/\d{2}:\d{2}/)?.[0] || null,
        details: text.slice(0, 200),
        // createdAt: Date.now()
    };
};

// const [transactions, setTransactions] = useState([]);
const saveReceiptToWeek = (receipt) => {
    // const transaction = {
    //     id: Date.now(),
    //     transType: "expense",
    //     ...receipt
    // };
    // const transactionArray = [...transactions];
    // transactionArray.push(transaction);
    // setTransactions(transactionArray);
    // localStorage.setItem("transactions", JSON.stringify(transactionArray));

    const transaction = {
        id: Date.now(),
        transType: "expense",
        ...receipt
    };

    // ✅ Always read from localStorage
    const existing =
        JSON.parse(localStorage.getItem("transactions")) || [];

    const updated = [...existing, transaction];

    localStorage.setItem("transactions", JSON.stringify(updated));
}