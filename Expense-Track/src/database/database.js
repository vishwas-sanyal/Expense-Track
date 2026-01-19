import { openDB } from "idb";

const createDB = async () => {
    return await openDB("WeeklyDataDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("weeks")) {
                db.createObjectStore("weeks", { keyPath: "weekId" });
            }
        }
    });
};

export const saveWeek = async (weekObject) => {
    const db = await createDB();

    await db.put("weeks", weekObject);
};

export const getAllWeeks = async () => {
    const db = await createDB();
    return await db.getAll("weeks");
};

export const getWeeklyData = async (weekId) => {
    const db = await createDB();
    return await db.get("weeks", weekId);
};

export const deleteWeek = async (weekId) => {
    const db = await createDB();
    return await db.delete("weeks", weekId);
};
