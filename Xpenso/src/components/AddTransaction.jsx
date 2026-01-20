import { useState } from "react";
import "./styles.css";

const today = new Date();
const day = today.getDate().toString().padStart(2, '0');
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const year = today.getFullYear();

const date = `${day}-${month}-${year}`;
const time = new Date().toLocaleTimeString();

const AddTransaction = ({ setToggle, AddTransactions }) => {
    const [amount, setAmount] = useState("");
    const [details, setDetails] = useState("");
    const [transType, setTransType] = useState("expense");


    const AddTransactionData = () => {
        AddTransactions({
            amount: Number(amount),
            details,
            transType,
            id: Date.now(),
            date,
            time,
        });
        // setToggle();
        setAmount("");
        setDetails("");
        setTransType("expense");
    };

    const money = new Audio("/money.mp3");

    return (
        <div className="container">
            <input
                type="number"
                placeholder="Enter Amount"
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                type="text"
                placeholder="Enter Details"
                className="input"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
            />

            <div className="radio-container">
                <div className="radio-btn">
                    <input
                        type="radio"
                        id="expense"
                        name="type"
                        value="expense"
                        checked={transType === "expense"}
                        onChange={(e) => setTransType(e.target.value)}
                    />
                    <label htmlFor="expense" className="label">Expense</label>
                </div>

                <div className="radio-btn">
                    <input
                        type="radio"
                        id="income"
                        name="type"
                        value="income"
                        checked={transType === "income"}
                        onChange={(e) => setTransType(e.target.value)}
                    />
                    <label htmlFor="income" className="label">Budget</label>
                </div>
            </div>

            <button className="submit-btn" onClick={() => { money.play(); AddTransactionData(); }}>
                Add Transaction
            </button>
        </div>
    );
};

export default AddTransaction;