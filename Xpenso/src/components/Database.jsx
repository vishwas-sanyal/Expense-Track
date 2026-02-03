import React, { useState, useEffect } from "react";
import "./styles.css";
import { getAllWeeks, getWeeklyData, deleteWeek } from "../database/database";

const Database = () => {
    const [open, setOpen] = useState(false);

    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [expandedWeekId, setExpandedWeekId] = useState(null);
    const [weekData, setWeekData] = useState([]);

    const click = new Audio("/click.mp3");

    // -----------------------------
    // LOAD WEEKS ON APP LOAD
    // -----------------------------
    useEffect(() => {
        loadWeeks();
    }, []);

    async function loadWeeks() {
        const data = await getAllWeeks();
        setWeeks(data);
    }

    // -----------------------------
    // WHEN WEEK IS CLICKED
    // -----------------------------
    // async function handleSelectWeek(week) {
    //     const weekData = await getWeeklyData(week.weekId);
    //     setSelectedWeek(week.weekId);
    //     setTransactions(weekData.transactions);
    //     // setOpen(false); // close drawer after selection (optional)
    // }

    // -----------------------------
    // DELETE WEEK
    // -----------------------------
    async function handleDeleteWeek(weekId) {
        await deleteWeek(weekId);
        setSelectedWeek(null);
        setTransactions([]);
        loadWeeks();
    }

    const handleWeekClick = async (weekId) => {
        if (expandedWeekId === weekId) {
            // second click → close
            setExpandedWeekId(null);
            setWeekData([]);
        } else {
            const data = await getWeeklyData(weekId);
            setExpandedWeekId(weekId);
            setWeekData(data.transactions || []);
        }
    };

    return (
        <div>

            {/* Top Left Button */}
            <button className="menu-btn" onClick={() => { setOpen(true); click.play(); }}>☰</button>

            {/* Backdrop */}
            <div
                className={`backdrop ${open ? "show" : ""}`}
                // onClick={() => setOpen(false)}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setOpen(false);
                    }
                }}
            />

            {/* Drawer */}
            <div className={`drawer ${open ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                    <button className="close-btn" onClick={() => { setOpen(false); click.play(); }}>✕</button>
                    <h2>Weekly Database</h2>
                </div>

                {/* DRAWER CONTENT */}
                <div>
                    {weeks.length === 0 ? (
                        <p>No items to show</p>
                    ) : (
                        <ul>
                            {weeks.map((week) => (
                                <li key={week.weekId} className="drawer-item">
                                    <span onClick={() => { handleWeekClick(week.weekId); click.play(); }}>
                                        {week.weekId}
                                    </span>


                                    <button onClick={() => { handleDeleteWeek(week.weekId); click.play(); }}>
                                        Remove
                                    </button>
                                    {/* EXPANDED DATA (INLINE) */}
                                    <div className={`week-expand ${expandedWeekId === week.weekId ? "open" : ""}`}>
                                        {expandedWeekId === week.weekId && (
                                            <ul className="week-data">
                                                {weekData.map((tx, i) => (
                                                    <li key={tx.id}>
                                                        <div>Date: {tx.date}</div>
                                                        <div>Time: {tx.time}</div>
                                                        <div>Amount: {tx.amount}</div>
                                                        <div>Detail: {tx.details}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )} </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Database;