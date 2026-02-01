import React, { useEffect, useState } from "react";
import { isPWA } from "./utils/pwaUtils";
import { setupInstallPrompt, installApp } from "./utils/install";
import { handleScan } from "./handleScan";

const ScanTransactions = ({ onScan }) => {
    const [installed, setInstalled] = useState(false);
    const [installable, setInstallable] = useState(false);

    const click = new Audio("/click.mp3");

    useEffect(() => {
        setInstalled(isPWA());
        setupInstallPrompt(setInstallable);
    }, []);

    const handleClick = () => {
        click.play();
        if (installed) {
            onScan = () => { handleScan(videoRef.current) } // open camera
        } else if (installable) {
            installApp();
        } else {
            alert("Install app on mobile for scanning support");
        }
    };

    return (
        <button
            onClick={handleClick}
            // style={{
            //     padding: "5px",
            //     borderRadius: "5px",
            //     cursor: "pointer",
            //     fontSize: "18px"
            // }}
            className="add-btn"
        >
            {installed ? "Scan Receipt" : "Install App"}
        </button>
    );
};

export default ScanTransactions;
