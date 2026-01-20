import React, { useEffect, useState } from "react";
import "./styles.css";
import TransactionItem from "./TransactionItem";

const TransactionsContainer = ({ transactions, removeTransaction }) => {
    const [searchInput, setSearchInput] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    const filteredData = (searchInput) => {
        if (!searchInput || !searchInput.trim().length) {
            setFilteredTransactions(transactions);
            return;
        }

        let filtered = [...transactions];
        filtered = filtered.filter((item) =>
            item.details.toLowerCase().includes(searchInput.toLowerCase().trim())
        );
        setFilteredTransactions(filtered);
    };

    useEffect(() => {
        filteredData(searchInput);
    }, [transactions, searchInput]);

    return (
        <div className="transactions-container">
            <h2 className="transactions-heading">Transactions</h2>

            <input
                type="text"
                placeholder="Search here"
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />

            <div className="transaction-items">
                {filteredTransactions?.length ? (
                    filteredTransactions.map((transaction) => (
                        <TransactionItem
                            transaction={transaction}
                            key={transaction.id}
                            removeTransaction={removeTransaction}
                        />
                    ))
                ) : (
                    <p className="no-transaction-text">No Transactions</p>
                )}
            </div>
        </div>
    );
};

export default TransactionsContainer;