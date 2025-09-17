import React from "react";
import "./styles.css";

const click = new Audio("/click.mp3");

const TransactionItem = ({ transaction, removeTransaction }) => {
    return (
        <div
            className={`transaction-item ${transaction?.transType === "expense" ? "expense-border" : "income-border"
                }`}
        >
            <span>{transaction.details}</span>
            <span>₹{transaction.amount}</span>
            <button
                className="remove-button"
                onClick={() => { removeTransaction(transaction.id); click.play(); }}
            >
                Remove
            </button>
        </div>
    );
};

export default TransactionItem;