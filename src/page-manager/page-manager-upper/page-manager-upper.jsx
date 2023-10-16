import "./page-manager-upper.css"

import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid"
import SortByBox from "./sort-by-box"
import OrderByBox from "./order-by-box"
import { useDispatch, useSelector } from "react-redux"
import { useFilterContext } from "../../utilites/filter-context"
import { db } from "../../authentication/config"
import { getDate } from "../../utilites/get-date"
import { fetchInitialData, initialFetch } from "../../store/home-slice"
import { initialWorkers } from "../../store/table-slice"
import { AddPerson, NavigateBackArrow, OrderBy, Refresh, Search, SortBy } from "../../assets/icons"
import { fetchWorkerData } from "../../store/worker-slice"
import AddingWorker from "./adding-worker"
import toast from "react-hot-toast"


export default function PageManagerUpper(){

    const [addingWorker, setAddingWorker] = useState(false)
    const [openSortingBox, setOpeningSortingBox] = useState(false)
    const [openOrderBox, setOpeningOrderBox]  = useState(false)
    const {filter, setFilter, fetchFilteredData, editingWorker, individualTable, workerID, tableName, sortOrder} = useFilterContext()

  
    const timeoutRef = useRef()

    

    const location = useLocation()
    const navigate = useNavigate()

    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const dispatch = useDispatch()

    useEffect(()=>{
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{

        fetchFilteredData() 

        }, 700)

    }, [filter])


    const navigateBack = ()=>{
        if(location.pathname === "/") return
    
        navigate(-1)
    }

    const toggleAddingWorkerModal = ()=>{

        if(!tableName) return
        setAddingWorker((prevState)=> !prevState)

    }

    const addWorker = (e, foodOrdered, totalPackets)=>{
        e.preventDefault()
        const uniqueID = nanoid(6)

        const newWorkerObj = {
            ID:uniqueID,
            listworker: e.target.addWorker.value,
            foodOrdered: foodOrdered,
            totalPackets: totalPackets,
            createdAt: getDate(),
            lastModified: getDate(),
        }

       updateTableData(newWorkerObj)
    

    }
    

   


    const updateTableData = async (workerObj)=>{
        

        try {
            const userDocRef = doc(db, 'users', uid);
            const tableDocRef = doc(userDocRef, 'tables', tableName);
        
            // Fetch the existing table data
            const tableDocSnapshot = await getDoc(tableDocRef);
        
            if (tableDocSnapshot.exists()) {
              const tableData = tableDocSnapshot.data();
        
              const newWorkersArray = [...tableData.workers, workerObj]
              // Update the workers array in the table data
              tableData.workers = newWorkersArray;
        
              // Update the lastModified timestamp
              tableData.lastModified = getDate();
            tableData.totalizer.totalPackets += workerObj.totalPackets
            tableData.totalizer.totalPlates = newWorkersArray.length
        
              // Save the updated table data back to Firestore
              await setDoc(tableDocRef, tableData);
              console.log('Table document updated:', tableDocRef.id);
              dispatch(initialWorkers(filter, uid, tableName))
              toast.success('successfully added worker')
            } else {
              console.log('Table document does not exist.');
            }
          } catch (error) {
            console.error('Error updating table document:', error);
            toast.error(error.message)
          }

    }

    const toggleOrderByBox = ()=>{
        if(editingWorker) return
        setOpeningOrderBox((prevState)=> !prevState)
        setOpeningSortingBox(false)
    }
    const toggleSortByBox = ()=>{
        if(editingWorker) return
        setOpeningSortingBox((prevState)=> !prevState)
        setOpeningOrderBox(false)
    }

    const handleChange = (e)=>{
        if(editingWorker) return
        setFilter(e.target.value)

    }

    const reloadData = ()=>{
        if(editingWorker){
            dispatch(fetchWorkerData(workerID, uid, tableName))

        }else{
            if(individualTable){
                dispatch(initialWorkers(filter, uid, tableName))
            }else{
                dispatch(fetchInitialData(filter, uid))
            }

        }

    }

    return(
        <>
        <div className="page-manager-upper">
        <div className="right-upper">
            <button className="left-upper" onClick={navigateBack}>
                <NavigateBackArrow/>
                <p>Back</p>
            </button>
            <div className="vertical-separator">
                <div className="vertical-separator-inner"></div>
            </div>
          
            <button onClick={reloadData}><Refresh/> reload</button>
            
            <div className="button-conainer">
                <button className={`button-toggle dropdown ${editingWorker ? 'grey' : ''}`} onClick={toggleSortByBox}><SortBy/>  Sort by  <NavigateBackArrow/> </button>
                { openSortingBox && <SortByBox openSortingBox={openSortingBox}/>}
            </div>
            
            <div  className="button-conainer">
                <button className={`button-toggle dropdown ${editingWorker ? 'grey' : ''} ${sortOrder === 'ascending' ? 'ascending' : ''}`} onClick={toggleOrderByBox}><OrderBy/> Sort order <NavigateBackArrow/></button>
                {openOrderBox && <OrderByBox openOrderBox={openOrderBox}/>}
            </div>
         
           
            <button className={`${individualTable ? '' : 'not-active'}`} onClick={toggleAddingWorkerModal}><AddPerson/>  Add person</button>
          
           
            
            </div>
            
            <div className={`search-container ${editingWorker ? 'grey' : ''}`}>
                <Search/>
                <input type="search" name="searchparams" placeholder="search table or person" onChange={handleChange}/>
                
            </div>
        </div>
        {addingWorker &&
        <AddingWorker toggleAddingWorkerModal={toggleAddingWorkerModal} addWorker={addWorker}/>
            }


        </>
    )
}
