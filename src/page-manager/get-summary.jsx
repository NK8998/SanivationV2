import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../authentication/config";
import { convertMonthDataToPdf } from "./convertTodpf";
import { getCurrentMonthAndYear } from "../utilites/get-date";
import toast from "react-hot-toast";

export const getSummary = async (setIsGenerating, filterRouteData, allMonths, uid)=>{
    // get all documents sort by month and give a summary of the totalPlates in each month
    setIsGenerating(true)
    const userDocRef = doc(db, 'users', uid);
    const allTablesRef = collection(userDocRef, 'tables');


    let tableData

    const {month, year} = getCurrentMonthAndYear()

    console.log(month, year)

    if (!allMonths) {
      const q = query(allTablesRef, where('month', '==', `${month}`), where('year', '==', year));

      const querySnapshot = await getDocs(q)

      if(!querySnapshot.empty){
        tableData = querySnapshot.docs.map((doc) => doc.data());

      }else{
        console.log('No matching documents found.');
        toast(
          "No tables were found",
          {
            duration: 2000,
            position: "top-center"
          }
        );
        return
      }

    }else{
      const querySnapshot = await getDocs(allTablesRef);
      if (!querySnapshot.empty) {
        tableData = querySnapshot.docs.map((doc) => doc.data());
      } else {
        console.log('No matching documents found.');
        toast(
          "No tables were found",
          {
            duration: 2000,
            position: "top-center"
          }
        );
        return
      }
    }
   

const allYearObjs = [];
let yearObj = { year: '', tables: [] };

tableData.forEach((table) => {
    const tableYear = table.createdAt.split('-')[2];
    if (tableYear !== yearObj.year) {
    // If the year changes, create a new year object
    if (yearObj.year) {
        allYearObjs.push(yearObj);
    }
    yearObj = { year: tableYear, tables: [] };
    }
    yearObj.tables.push(table);
});

// Push the last year object if it contains tables
if (yearObj.year) {
    allYearObjs.push(yearObj);
}

const mergedYearObjs = [];

allYearObjs.forEach((yearObj) => {
const existingYear = mergedYearObjs.find((mergedYear) => mergedYear.year === yearObj.year);

if (existingYear) {
    // Year object with the same year already exists, merge the tables
    existingYear.tables = existingYear.tables.concat(yearObj.tables);
} else {
    // Year object with this year doesn't exist, add a new one
    mergedYearObjs.push({ year: yearObj.year, tables: yearObj.tables });
}
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthArrays = [];

mergedYearObjs.forEach((yearObj) => {
  const monthGroups = new Map(); // Use a Map to group tables by month
  yearObj.tables.forEach((table) => {
    const month = parseInt(table.createdAt.split('-')[1]);
    const monthName = months[month - 1];

    if (!monthGroups.has(monthName)) {
      monthGroups.set(monthName, []);
    }
    monthGroups.get(monthName).push(table);
  });

  // Now, iterate through the Map and create month objects
  monthGroups.forEach((tables, monthName) => {
    const monthObj = {
      year: yearObj.year,
      month: monthName,
      tableArray: tables,
    };
    monthArrays.push(monthObj);
  });
});

console.log(monthArrays)

// get the totalPlates and totalPackets
let summarizedMonthData = []; // Assuming you have your month data here

// Iterate over each month
monthArrays.forEach((month) => {
  let totalPackets = 0;
  let totalPlates = 0;

  // Iterate over each table within the month
  month.tableArray.forEach((table) => {
    // Assuming table is an object with properties totalPackets and totalPlates
    totalPackets += table.totalizer.totalPackets || 0;
    totalPlates += table.totalizer.totalPlates || 0;
  });

  // Create a summary object for the current month
  const monthTotalizerObj = {
    year: month.year,
    month: month.month,
    totalPackets: totalPackets,
    totalPlates: totalPlates,
  };

  // Push the summary object to the monthArrays
  summarizedMonthData.push(monthTotalizerObj);
});

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

console.log('Current Month:', currentMonth);

// if(!allMonths){
//   summarizedMonthData = summarizedMonthData.filter((month)=> month.month === currentMonth)
// }

const sortedsummarizedMonthData = filterRouteData(summarizedMonthData, 'true')

// Now, monthArrays contains totalPackets and totalPlates for each month
console.log(sortedsummarizedMonthData);
await convertMonthDataToPdf(sortedsummarizedMonthData)
setIsGenerating(false)

}