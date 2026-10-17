const XLSX = require("xlsx");
const fs = require("fs");

function convertExcel() {
    const workbook = XLSX.readFile("products.xlsx");
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    const output = "const products = " + JSON.stringify(json, null, 4) + ";";

    fs.writeFileSync("product-data.js", output);

    console.log("✔ product-data.js обновлён автоматически!");
}

convertExcel();
