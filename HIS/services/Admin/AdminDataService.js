import * as api from '../../Api/Admin/adminApi';

export async function loadFullDB() {
    const tables = await api.getTables();
    const schema = await api.getSchema();

    return mergeTableWithSchema(tables, schema);
}

function mergeTableWithSchema(tables, schema) {
    // --邏輯---
    ////範例假檔案,未實作功能///
}