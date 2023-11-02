import toast from "react-hot-toast";
import { utils, writeFile } from "xlsx";
import { getCurrentMonthAndYear } from "../utilites/get-date";

export const convertToExcel = async (tableData)=>{
    const workbook = utils.book_new();

    const {month, year} = getCurrentMonthAndYear()
    tableData.forEach((table) => {
        const monthYear = table.month + ' ' + table.year;
        const tableName = table.tableName;

        const worksheetData = [];
        // worksheetData.push([monthYear]);
        // worksheetData.push([tableName]);
        // worksheetData.push([]);
        worksheetData.push(['S/no', 'Worker', 'Main', 'Stew', 'Greens', 'Drinks', 'Extra']);

        // Create a format object for bold text
        const boldStyle = { bold: true };

        // Apply the bold style to the "Worker" and "Food Ordered" row
        worksheetData[worksheetData[0]] = [
        { v: 'sno', s: boldStyle }, { v: 'Worker', s: boldStyle }, { v: 'Main', s: boldStyle }, { v: 'Stew', s: boldStyle }, { v: 'Greens', s: boldStyle }, { v: 'Drinks', s: boldStyle }, { v: 'Extra', s: boldStyle }
        ];

        // Create rows for each worker with each food item in its own cell
        table.workers.forEach((worker, index) => {
        const workerRow = [(index + 1), worker.listworker, ...worker.foodOrdered];
        worksheetData.push(workerRow);
        });

        // Create the worksheet with data
        const worksheet = utils.aoa_to_sheet(worksheetData);

        // Add the worksheet to the workbook with a name based on tableName
        utils.book_append_sheet(workbook, worksheet, tableName);
    });

    // Save the workbook as an Excel file
    writeFile(workbook, `ntp-${month + '-' + year}.xlsx`);

    toast.success('excel sheet generated')
}