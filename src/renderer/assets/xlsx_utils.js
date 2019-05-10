/* from app code, require('electron').remote calls back to main process */
var dialog = require('electron').remote.dialog;
var XLSX = require('xlsx');

export function readXlsxWorkbook() {
    /* show a file-open dialog and read the first selected file */
    var o = dialog.showOpenDialog({properties: ['openFile']});
    return XLSX.readFile(o[0]);
}

export function checkNan(val) {
    if (isNaN(val)) {
        return 0;
    }
    return val;
}

export function saveWorkbook(name, workbook) {
    /* show a file-save dialog and write the workbook */
    var o = dialog.showSaveDialog({
        filters: [
            {name: 'workbooks', extensions: ['xlsx']}
        ]
    });
    XLSX.writeFile(workbook, o);
}

export function createWorkSheet(wb, data, name) {
    var ws = XLSX.utils.aoa_to_sheet(data);
    wb.SheetNames.push(name);
    wb.Sheets[name] = ws;
    return wb;
}

export function createWorkbook() {
    return XLSX.utils.book_new();
}