// import React, { useEffect, useState } from "react";
// import { isPWA } from "./utils/pwaUtils";
// import { setupInstallPrompt, installApp } from "./utils/install";
// import { handleScan } from "./handleScan";

// const ScanTransactions = ({ onScan }) => {
//     const [installed, setInstalled] = useState(false);
//     const [installable, setInstallable] = useState(false);

//     const click = new Audio("/click.mp3");

//     useEffect(() => {
//         setInstalled(isPWA());
//         setupInstallPrompt(setInstallable);
//     }, []);

//     const handleClick = () => {
//         click.play();
//         if (installed) {
//             onScan = () => { openCamera(); handleScan(videoRef.current); } // open camera
//         } else if (installable) {
//             installApp();
//         } else {
//             alert("Install app on mobile for scanning support");
//         }
//     };
//     const openCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: {
//                     facingMode: { ideal: "environment" }
//                 },
//                 audio: false
//             });

//             videoRef.current.srcObject = stream;
//         } catch (err) {
//             alert("Camera permission denied or not available");
//             console.error(err);
//         }
//     };

//     return (
//         <button
//             onClick={handleClick}
//             // style={{
//             //     padding: "5px",
//             //     borderRadius: "5px",
//             //     cursor: "pointer",
//             //     fontSize: "18px"
//             // }}
//             className="add-btn"
//         >
//             {installed ? "Scan Receipt" : "Install App"}
//         </button>
//     );
// };

// export default ScanTransactions;

import React, { useEffect, useRef, useState } from "react";
import { isPWA } from "./utils/pwaUtils";
import { setupInstallPrompt, installApp } from "./utils/install";
import { handleScan } from "./handleScan";

const ScanTransactions = () => {
    const [installed, setInstalled] = useState(false);
    const [installable, setInstallable] = useState(false);
    const videoRef = useRef(null);

    const click = new Audio("/click.mp3");

    useEffect(() => {
        setInstalled(isPWA());
        setupInstallPrompt(setInstallable);
    }, []);

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: "environment" } },
                audio: false
            });

            videoRef.current.srcObject = stream;
        } catch (err) {
            alert("Camera permission denied or unavailable");
            console.error(err);
        }
    };

    const handleClick = () => {
        click.play();

        if (installed) {
            openCamera(); // 👈 only open camera
        } else if (installable) {
            installApp();
        } else {
            alert("Install app on mobile for scanning support");
        }
    };

    return (
        <>
            <button className="add-btn" onClick={handleClick}>
                {installed ? "Scan Receipt" : "Install App"}
            </button>

            {/* Camera Preview */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", display: installed ? "block" : "none" }}
            />

            {/* Capture Button */}
            {installed && (
                <button
                    onClick={() => handleScan(videoRef.current)}
                    className="add-btn"
                >
                    Capture & Scan
                </button>
            )}
        </>
    );
};

export default ScanTransactions;
