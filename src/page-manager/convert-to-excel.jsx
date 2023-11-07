import toast from "react-hot-toast";
import { utils, writeFile } from "xlsx";
import { getCurrentMonthAndYear } from "../utilites/get-date";

import ExcelJS from 'exceljs';
export const convertToExcel = async (tableData) => {
    const workbook = utils.book_new();
    
    const totalTypes = {}; // Object to store type totals

    tableData.forEach((table) => {
      const createdAt = `${table.createdAt.split('-')[0]}-${table.month}-${table.year}`;
      const worksheetData = [];
  
      // Create a map to store workers by type for each table
      const groupedWorkers = new Map();
  
      // Iterate through workers
      table.workers.forEach((worker) => {
        const { type, listworker } = worker;
  
        if (!groupedWorkers.has(type)) {
          groupedWorkers.set(type, []);
        }
  
        groupedWorkers.get(type).push(listworker);
      });
  
      const typesArray = Array.from(groupedWorkers.keys());

      // Create a column that spans from 1 to maxWorkers
      const maxWorkers = Math.max(...Array.from(groupedWorkers.values(), (workers) => workers.length));
      const indexColumn = Array.from({ length: maxWorkers }, (_, i) => [i + 1]);
        // Add the index column as a type with an empty string key
      const newGroupedWorkers = new Map([[' ', indexColumn], ...groupedWorkers]);

      worksheetData.push([' ', ...typesArray]);

  
      // Add workers under types in columns for each table
      for (let i = 0; i < maxWorkers; i++) {
        const workerRow = [];
  
        newGroupedWorkers.forEach((workers) => {
          workerRow.push(workers[i] || '');
        });
  
        worksheetData.push(workerRow);
      }

      
    

      const totalsRow = []

      typesArray.forEach((type, index) => {
       
      totalsRow.push([newGroupedWorkers.get(type).length]);
     
      });
      worksheetData.push(['Total', ...totalsRow])
      typesArray.forEach((type) => {
        if (!totalTypes[type]) {
          totalTypes[type] = 0;
        }
        totalTypes[type] += newGroupedWorkers.get(type).length;
      });
  
      // Create the worksheet with the modified data
      const worksheet = utils.aoa_to_sheet(worksheetData);
  
      // Add the worksheet to the workbook with a specific name
      utils.book_append_sheet(workbook, worksheet, `${createdAt}-${table.tableID}`);
    });


    const totalWorksheetData = [['Type', 'Total']];
    Object.keys(totalTypes).forEach((type) => {
    totalWorksheetData.push([type, totalTypes[type]]);
    });

    const totalWorksheet = utils.aoa_to_sheet(totalWorksheetData);
    utils.book_append_sheet(workbook, totalWorksheet, 'TotalTypes');
  
    // Save the workbook as an Excel file
    writeFile(workbook, 'ntp-workers.xlsx');
  
    toast.success('Excel sheet generated');
};

  
  
  
  
  
  
  
  
  
  