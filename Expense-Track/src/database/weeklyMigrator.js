import { saveWeek } from "./database";

export function runWeeklyMigration() {

    const getPreviousWeekId = () => {
        const now = new Date();
        const year = now.getFullYear();

        const firstDay = new Date(year, 0, 1);
        const days = Math.floor((now - firstDay) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + firstDay.getDay() + 1) / 7) - 1;

        return `${year}-W${String(week).padStart(2, "0")}`;
    };

    const rawTransactions = localStorage.getItem("transactions");

    if (!rawTransactions) return;

    const transactions = JSON.parse(rawTransactions);

    if (transactions.length === 0) return;

    const previousWeek = getPreviousWeekId();
    const lastSavedWeek = localStorage.getItem("lastSavedWeek");

    if (lastSavedWeek === previousWeek) return;

    const weekObject = {
        weekId: previousWeek,
        transactions: transactions,
        savedAt: new Date().toISOString()
    };

    saveWeek(weekObject);

    localStorage.removeItem("transactions");
    localStorage.setItem("lastSavedWeek", previousWeek);
}

// export function runWeeklyMigration() {

//     const currentWeekId = () => {
//         const now = new Date();
//         const year = now.getFullYear();

//         // Week number calc
//         const firstDay = new Date(year, 0, 1);
//         const days = Math.floor((now - firstDay) / (24 * 60 * 60 * 1000));
//         const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

//         return `${year}-W${String(week).padStart(2, "0")}`;
//     };

//     const previousWeekId = () => {
//         const now = new Date();
//         const year = now.getFullYear();

//         // Week number calc
//         const firstDay = new Date(year, 0, 1);
//         const days = Math.floor((now - firstDay) / (24 * 60 * 60 * 1000));
//         const week = Math.ceil(((days + firstDay.getDay() + 1) / 7) - 1);

//         return `${year}-W${String(week).padStart(2, "0")}`;
//     };

//     if (localStorage["transactions"].length > 0) {
//         const lastSavedWeek = localStorage["lastSavedWeek"];
//         const currentWeek = currentWeekId();
//         if (currentWeek != lastSavedWeek) {
//             const weeklyTransactions = JSON.parse(localStorage["transactions"])
//             const weekId = previousWeekId();
//             const weekObject = {
//                 weekId,
//                 transactions: weeklyTransactions,
//             }
//             saveWeek(weekObject);
//             localStorage.removeItem("transactions");
//             localStorage["lastSavedWeek"] = previousWeekId();
//         }
//     }
// }
