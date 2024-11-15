import { useEffect, useState } from "react"
import "./home.css"
import { useDispatch, useSelector } from "react-redux"
import { fetchDynamicData, fetchInitialData, removeTableFromArray } from "../../store/home-slice"
import { useFilterContext } from "../../utilites/filter-context"
import { Link, useLocation } from "react-router-dom"
import { HappyIcon, SadIcon, TrashIcon } from "../../assets/icons"
import RemoveTableModal from "./modal"

export default function Home({}){

    const allTables = useSelector((state)=> state.home.alltables)
    const loading = useSelector((state)=> state.home.loading)
    const {filter, filterRouteData, bottomReached, sortBy, sortOrder, tableCluster} = useFilterContext()

    const dispatch = useDispatch()
    const userData = useSelector((state)=> state.auth.userData)
    const {uid} = userData
    const [currentTable, setCurrentTable] = useState({})
    const [removingTableModal, setRemoveTableModal] = useState(false)

    useEffect(()=>{
// initial fetch for tables 
    dispatch(fetchInitialData('', uid))
 
    }, [])

    useEffect(()=>{
        // fetch tables dynamically
        const fetchedTableIds = allTables.map((table)=> {return table.tableID})
        dispatch(fetchDynamicData(filter, uid, fetchedTableIds, loading))
      
    }, [bottomReached])

    useEffect(()=>{

    }, [sortOrder, sortBy])

    const removeTable = async ()=>{
    
        dispatch(removeTableFromArray(allTables, uid, currentTable.tableName))
        setRemoveTableModal((prevState)=>!prevState)
    }

    const toggleRemoveModal = (e, tableObj)=>{

        e.stopPropagation()
        e.preventDefault()

        setCurrentTable(tableObj)
        setRemoveTableModal((prevState)=>!prevState)

    }
    let allTablesEl
 

    if(tableCluster === 0){

        const sortedTablesArray = filterRouteData(allTables)

        allTablesEl = sortedTablesArray.map((table, index)=>{

           
            return(
                <div key={index}>
                <p className="date">{table?.createdAt}</p>
                <div className="index-and-table">
                    <p>{index + 1}</p>
                    <div className="table-wrapper">
                    <div className="listname outer" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>

                        <Link to={`/${table?.tableName}`} key={table?.tableName || ''} className="date-wrapper">

                            <div className={`table last`}>

                                <div className="name-and-title">
                                    <span>Name</span>
                                    <div className="listname inner" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>
                                    <p className="name">{table?.tableName.split('_')[0] || table?.tableName}</p>
                                </div>
                                
                                <p><span>Table ID</span>#{table?.tableID}</p>
                                <p><span>Created At</span>{table?.createdAt || ''}</p>
                                <p ><span>Last Modified</span>{table?.lastModified || ''}</p>
                                <p className="remove inner" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>

                            </div>

                        </Link>
                        <p className="remove outer" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>

                    </div>
                </div>
                </div>
            
            )
    
        })

    }else if(tableCluster === 1){
   
    const allYearObjs = [];
    let yearObj = { year: '', tables: [] };
    
    allTables.forEach((table) => {
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

    const sortedYearsObjArray = filterRouteData(mergedYearObjs, 'true');

  
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthArrays = [];
    
    sortedYearsObjArray.forEach((yearObj) => {
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
          tableArray: filterRouteData(tables),
        };
        monthArrays.push(monthObj);
      });
    });

  


    allTablesEl = monthArrays.map((month, index)=>{
        const allMonthsArray = month?.tableArray || []
        return (
            <div className="date-wrapper" key={index}>
            <p className="date">{month?.month} {month?.year}</p>
            <div className="table-wrapper">

            {allMonthsArray.map((table, index)=>{
                return(


                    <Link to={`/${table?.tableName}`} key={table?.tableName || ''} className={`month table ${index === 0 ? 'first-row' : '' } separation ${index === allMonthsArray.length - 1 ? 'last' : ''}`}>
                    <div className="listname outer" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>

                        <div className="months-table">
                            <div className="name-and-title">
                            <div className="listname inner" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>
                                <span>Name</span>
                                <p className="name">{table?.tableName.split('_')[0] || table?.tableName}</p>
                            </div>
                            <p><span>Table ID</span>#{table?.tableID}</p>
                            <p><span>Created at</span>{table?.createdAt}</p>
                            <p><span>Last modified</span>{table?.lastModified}</p>
                            <p className="remove inner" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>
                        </div>
                        <p className="remove outer" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>

                    </Link>
                )
            })}
            </div>

            </div>
        )
    })

    }else if(tableCluster === 2){
        const allYearObjs = [];
        let yearObj = { year: '', tables: [] };
        
        allTables.forEach((table) => {
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
    
      
        const sortedByYear = filterRouteData(mergedYearObjs, 'true')
        
        sortedByYear.forEach((yearObj)=>{
            yearObj.tables = filterRouteData(yearObj.tables)
        })
   

       allTablesEl =  sortedByYear.map((yearObj, index)=>{
        const allYearArray = yearObj?.tables || []
        return(
// display year and map over the array of tables
  
            <div className="date-wrapper" key={index}>
                <p className="date">{yearObj?.year}</p>
                <div className="table-wrapper">
                {allYearArray.map((table, index)=>{
                    return(
                      
                        <Link to={`/${table?.tableName}`} key={table?.tableName || ''} className={`month table ${index === 0 ? 'first-row' : '' } separation  ${index === allYearArray.length - 1 ? 'last' : ''}`}>
                        <div className="listname outer" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>
    
                            <div className="months-table">
                                <div className="name-and-title">
                                <div className="listname inner" title={table?.listName || 'generic'}>{table?.listName && table?.listName[0] || 'T'}</div>
                                    <span>Name</span>
                                    <p className="name">{table?.tableName.split('_')[0] || table?.tableName}</p>
                                </div>
                                <p><span>Table ID</span>#{table?.tableID}</p>
                                <p><span>Created at</span>{table?.createdAt}</p>
                                <p><span>Last modified</span>{table?.lastModified}</p>
                                <p className="remove inner" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>
                            </div>
                            <p className="remove outer" onClick={(e)=>{toggleRemoveModal(e, table)}}><TrashIcon/></p>
    
                        </Link>
                  
                    )
                })}
                </div>
               
            </div>
        )
       })

    }
      

    return(
        <div className="home">
            {loading ?
            <>
                <div className="loader-skeleton small"></div>
                <div className="loader-skeleton"></div> 

                <div className="loader-skeleton small"></div>
                <div className="loader-skeleton"></div> 

                <div className="loader-skeleton small"></div>
                <div className="loader-skeleton"></div> 

                <div className="loader-skeleton small"></div>
                <div className="loader-skeleton"></div> 

                <div className="loader-skeleton small"></div>
                <div className="loader-skeleton"></div> 

             </>
             : 
             allTablesEl}
            {
            !loading &&

            allTables.length === 0 ?
            <div className="nothing-wrapper">
             <div className="nothing">
                <h2 className="nothing-top">Nothing here.<SadIcon/></h2>
                <p className="nothing-bottom">If you want to add tables navigate to the side bar to the left of your screen. From there you can create a list and use it to create your tables. </p>
             </div>
             </div>
            :<></>
            }
{   removingTableModal &&   <RemoveTableModal setRemoveTableModal={setRemoveTableModal} currentTable={currentTable} removeTable={removeTable}/>}
        </div>
    )

}