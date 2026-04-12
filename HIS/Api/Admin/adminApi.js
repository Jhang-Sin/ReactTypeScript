export async function getTables() {
    const res = await fetch('/HIS/data/tables.json');
    return res.json();
}

export async function getSchema() {
    const res = await fetch('/HIS/data/schema.json');
    return res.json();
}
