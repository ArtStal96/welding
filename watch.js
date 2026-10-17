const chokidar = require("chokidar");
const { exec } = require("child_process");

console.log("👀 Ожидаю изменения Excel...");

chokidar.watch("products.xlsx").on("change", () => {
    console.log("📄 Excel изменён → обновляю product-data.js...");
    exec("node convert.js");
});
