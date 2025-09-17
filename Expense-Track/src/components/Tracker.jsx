import React, { useEffect, useState } from "react";
import "./styles.css";
import AddTransaction from "./AddTransaction";
import OverviewComponent from "./OverviewComponent";
import TransactionsContainer from "./TransactionsContainer";

const Tracker = () => {
    const [toggle, setToggle] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [expense, setExpense] = useState(0);
    const [income, setIncome] = useState(0);

    // const AddTransactions = (payload) => {
    //     const transactionArray = [...transactions];
    //     transactionArray.push(payload);
    //     setTransactions(transactionArray);
    // };
    const AddTransactions = (payload) => {
        const transactionArray = [...transactions];
        transactionArray.push(payload);
        setTransactions(transactionArray);

        // ✅ Save to localStorage whenever we add a transaction
        localStorage.setItem("transactions", JSON.stringify(transactionArray));
    };

    // const removeTransaction = (id) => {
    //     const updatedTransactions = transactions.filter(
    //         (transaction) => transaction.id !== id
    //     );
    //     setTransactions(updatedTransactions);
    // };
    const removeTransaction = (id) => {
        const updatedTransactions = transactions.filter(
            (transaction) => transaction.id !== id
        );
        setTransactions(updatedTransactions);

        // ✅ Update localStorage after removal
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    };

    const calculateTransactions = () => {
        let exp = 0;
        let inc = 0;

        transactions.forEach((item) => {
            item.transType === "expense"
                ? (exp += item.amount)
                : (inc += item.amount);
        });

        setExpense(exp);
        setIncome(inc);
    };

    // useEffect(() => {
    //     calculateTransactions();
    // }, [transactions]);
    // ✅ On component mount, load saved data
    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
        if (savedTransactions && savedTransactions.length > 0) {
            setTransactions(savedTransactions);
        }
    }, []); // Runs once on mount

    // Recalculate income/expense whenever transactions change
    useEffect(() => {
        calculateTransactions();
    }, [transactions]);

    return (
        <div className="tracker-container">
            <h1 className="heading">Expense-Track</h1>

            <OverviewComponent
                toggle={toggle}
                setToggle={setToggle}
                expense={expense}
                income={income}
            />

            {toggle && (
                <AddTransaction
                    setToggle={setToggle}
                    AddTransactions={AddTransactions}
                />
            )}

            <div className="transaction-details">
                <div className="expense-box">
                    Expense <span className="expense-amount">₹{expense}</span>
                </div>

                <div className="income-box">
                    Budget <span className="income-amount">₹{income}</span>
                </div>
            </div>

            <TransactionsContainer
                transactions={transactions}
                removeTransaction={removeTransaction}
            />
        </div>
    );
};

export default Tracker;