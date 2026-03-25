export async function getTables() {
    const res = await fetch('/HIS/data/tables.json');
    return res.json();
}

export async function getSchema() {
    const res = await fetch('/HIS/data/schema.json');
    return res.json();
}

////範例假檔案,未實作功能///