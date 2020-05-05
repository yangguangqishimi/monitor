const Excel = require('exceljs');
const fs = require('fs');

function saveListToExcelFile(list, titles, sheetName, filePath) {

    return new Promise((resolve, reject) => {
        var workbook = new Excel.Workbook();

        workbook.creator = 'Tinoq';
        workbook.lastModifiedBy = 'Tinoq';
        workbook.created = new Date();
        workbook.modified = new Date();



        var worksheet = workbook.addWorksheet(sheetName);

        let cols = [];

        titles.forEach(title => {
            cols.push({
                header: title,
                key: title
            });
        });

        worksheet.columns = cols;

        list.forEach(row => {

            worksheet.addRow(row)

        });



        workbook.xlsx.writeFile(filePath)
            .then(function (data) {
                resolve();
            });
    });
}

function genExcel(sheetName, columns, data) {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Tinoq';
    workbook.lastModifiedBy = 'Tinoq';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns.map(x => {
        x.style = { font: { size: 12 }, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true } };
        return x;
    });
    worksheet.addRows(data);
    return workbook.xlsx;
}

async function readExcel(filename) {
    const wb = new Excel.Workbook();
    const xlsx = await wb.xlsx.readFile(filename);
    const data = [];
    xlsx.worksheets[0].eachRow((row, rowNumber) => {
        data.push(row.values);
    });
    return data;
}

async function writeDataToSheet(filename, sheetName, dataMaxtrix) {
    const wb = new Excel.Workbook();
    const xlsx = await wb.xlsx.readFile(filename);
    const sheet = xlsx.getWorksheet(sheetName);
    dataMaxtrix.map((columns,i) => {
        const row = sheet.getRow(i+1);
        columns.map((x, j) => {
            row.getCell(j+1).value = x;
        });
        row.commit();
    });
    
    await xlsx.xlsx.writeFile(filename);
    console.log('done');
}

module.exports = {
    saveListToExcelFile,
    readExcel,
    genExcel
};

// writeDataToSheet('/Users/lifugui/Desktop/classList.xlsx', '课程列表', [[],['阴瑜伽'],['yoga'],['ge dou']]);