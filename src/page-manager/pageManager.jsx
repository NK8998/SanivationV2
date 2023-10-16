import { useDispatch, useSelector } from 'react-redux';
import Header from '../navigation/header/header';
import SideNav from '../navigation/side-nav/side-nav';
import PageManagerUpper from './page-manager-upper/page-manager-upper';
import AllRoutes from './all-routes/allRoutes';
import ModalsExport from './modals-export/modals-exports';
import { Burger, PrinterIcon } from '../assets/icons';
import { useState } from 'react';
import { db } from '../authentication/config';
import { collection, doc, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import { convertMonthDataToPdf } from './convertTodpf';
import { Toaster } from 'react-hot-toast';
import { useFilterContext } from '../utilites/filter-context';


export default function PageManager(){

    const [showNav, setShowNav] = useState(false)

    const userData = useSelector((state)=>state.auth.userData)
    const {filterRouteData} = useFilterContext()
    const {uid } = userData
    const toggleNav = ()=>{
        setShowNav((prevState) =>!prevState)
    }

    const getSummary = async ()=>{
        // get all documents sort by month and give a summary of the totalPlates in each month

        const userDocRef = doc(db, 'users', uid);
        const allTablesRef = collection(userDocRef, 'tables');

        const querySnapshot = await getDocs(allTablesRef);

        let tableData
        if (!querySnapshot.empty) {
          tableData = querySnapshot.docs.map((doc) => doc.data());
        } else {
          console.log('No matching documents found.');
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
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthArrays = [];
    
    allYearObjs.forEach((yearObj) => {
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
    const summarizedMonthData = []; // Assuming you have your month data here
    
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

    const sortedsummarizedMonthData = filterRouteData(summarizedMonthData, 'true')
    
    // Now, monthArrays contains totalPackets and totalPlates for each month
    console.log(sortedsummarizedMonthData);
    convertMonthDataToPdf(sortedsummarizedMonthData)
}


  
    return(
        <>
        <Toaster position="top-right"/>

        <div className='page-manager'>
        <SideNav showNav={showNav} toggleNav={toggleNav}/>
            <div className='header-and-pages'>
                <div className='header-burger' onClick={toggleNav}>
                    <Burger/>
                </div>
                <div className='orders-and-summary'>
                  <h1>Orders</h1>
                  <button onClick={getSummary} title='get summary'><PrinterIcon/></button>
                </div>
                <div className='page-rendered'>
                    <PageManagerUpper/>
                        <Header/>
                        <AllRoutes/>
                 
                </div>
            </div>
            <div className='company-picture'>

            </div>
        </div>
        <ModalsExport/>
        </>
    )
}