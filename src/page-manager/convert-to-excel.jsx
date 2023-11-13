import toast from "react-hot-toast";
import { utils, writeFile, writeFileXLSX } from "xlsx";
import { getCurrentMonthAndYear } from "../utilites/get-date";
import { writeXLSX } from "xlsx-js-style";
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
      // console.log(worksheet)

      // const newWorkSheet = {
      //   '!ref': "A1:D5",
      //   A1: {v: ' ', t: 's'},
      //   A2: {v: 1, f: undefined, t: 'n', s: { font: { name: "Courier", sz: 24 } }},
      //   A3: {v: 2, f: undefined, t: 'n', s:{ font: { name: "Courier", sz: 24 } }},
      //   A4: {v: 3, f: undefined, t: 'n'},
      //   A5: {v: 'Total', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   B1: {v: 'COGS', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   B2: {v: 'jackson', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   B3: {v: 'Jack', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   B4: {v: '', t: 's'},
      //   B5: {v: 2, f: undefined, t: 'n'},
      //   C1: {v: 'Casual', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   C2: {v: 'Neil', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   C3: {v: 'Michale', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   C4: {v: 'Jonathan', t: 's', s:{ font: { name: "Courier", sz: 24 } }},
      //   C5: {v: 3, f: undefined, t: 'n', s:{ font: { name: "Courier", sz: 24 } }},
      //   D1: {v: 'HQ', t: 's'},
      //   D2: {v: 'Mike', t: 's'},
      //   D3: {v: '', t: 's'},
      //   D4: {v: '', t: 's'},
      //   D5: {v: 1, f: undefined, t: 'n'}
      // };
      
  
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

  
  
  
  
  
  
  
  
  
  