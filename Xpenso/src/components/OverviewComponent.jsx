import "./styles.css";
// import ScanTransactions from "./ScanTransactions.jsx"

const OverviewComponent = ({ toggle, setToggle, income, expense }) => {
    const bal = income - expense;

    const click = new Audio("/click.mp3");

    return (
        <div className="overview-container">
            <h2 className="balance">
                Balance <span>₹{bal}</span>
            </h2>
            {/* <button>Scan</button><ScanTransactions /> */}
            <button
                className="add-btn"
                onClick={() => { setToggle(!toggle); click.play(); }}
            >
                {toggle ? "Cancel" : "Add"}
            </button>
        </div>
    );
};

export default OverviewComponent;