import React, { useEffect, useState } from "react";
import "./styles.css";
import AddTransaction from "./AddTransaction";
import OverviewComponent from "./OverviewComponent";
import TransactionsContainer from "./TransactionsContainer";
import { runWeeklyMigration } from "../database/weeklyMigrator";
import Database from "./Database";

const Tracker = () => {
    const [toggle, setToggle] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [expense, setExpense] = useState(0);
    const [income, setIncome] = useState(0);

    const AddTransactions = (payload) => {
        const transactionArray = [...transactions];
        transactionArray.push(payload);
        setTransactions(transactionArray);

        // ✅ Save to localStorage whenever we add a transaction
        localStorage.setItem("transactions", JSON.stringify(transactionArray));
    };

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

    // useEffect(() => {
    //     runWeeklyMigration();
    // }, []);

    // setTimeout(() => {
    //     runWeeklyMigration();
    // }, 604800000)

    function isWeekend() {
        const day = new Date().getDay(); // 0 = Sun, 6 = Sat
        return day === 0 || day === 6;
    }

    function checkWeeklyMigration() {
        const lastRun = Number(localStorage.getItem("lastSavedWeek"));

        if (
            isWeekend() &&
            (!lastRun || Date.now() - lastRun >= WEEK)
        ) {
            runWeeklyMigration();
            localStorage.setItem("lastSavedWeek", Date.now());
        }
    }

    useEffect(() => {
        checkWeeklyMigration();
    }, []);


    return (
        <div className="tracker-container">
            <Database />
            {/* <h1 className="heading">Xpenso</h1> */}
            <img className="heading" src="/Xpenso.svg" alt="Xpenso" />

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