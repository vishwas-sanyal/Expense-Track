import React from "react";
import "./styles.css";

const click = new Audio("/click.mp3");

const TransactionItem = ({ transaction, removeTransaction }) => {
    return (
        // <div>
        //     <div className={`transaction-item ${transaction?.transType === "expense" ? "expense-border" : "income-border"}`}>
        //         <span>{transaction.details}</span>
        //         <span>₹{transaction.amount}</span>

        //         <button
        //             className="remove-button"
        //             onClick={() => { removeTransaction(transaction.id); click.play(); }}
        //         >
        //             Remove
        //         </button>

        //     </div>
        //     <div className="date">
        //         <span>{transaction.date}</span>
        //         <span>{transaction.time}</span>
        //     </div>
        // </div>
        <div className="transaction-wrapper">

            <div
                className={`transaction-item ${transaction?.transType === "expense"
                    ? "expense-border"
                    : "income-border"
                    }`}
            >
                <span className="detail">{transaction.details}</span>
                <span className="amount">{transaction.amount}</span>

                <button
                    className="remove-button"
                    onClick={() => {
                        removeTransaction(transaction.id);
                        click.play();
                    }}
                >
                    Remove
                </button>
            </div>
            <div className="date">
                <span>{transaction.date}</span>
                <span>{transaction.time}</span>
            </div>
        </div>
    );
};

export default TransactionItem;