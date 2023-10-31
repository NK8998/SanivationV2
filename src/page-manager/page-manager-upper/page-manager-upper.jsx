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
    const [isSubmitting, setIsSubmitting] = useState(false)
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

        if(!individualTable) return
        setAddingWorker((prevState)=> !prevState)

    }

    const addWorker = (e, foodOrdered, totalPackets)=>{
        e.preventDefault()
        const inputValue = document.querySelector('[name="addWorker"]').value;

        if(inputValue.trim() === ''){
          toast.error('please add a name')
          return
        }
        const uniqueID = nanoid(6)

        setIsSubmitting(true)

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
              const newArrray = []
   
              tableData.workers.map((worker)=>{
                let workerFoodArray = [...worker.foodOrdered]
              
                const filteredArrray =   workerFoodArray.filter(food=> !food.includes(' milk '))
          
                  for(let i = 0; i < worker.totalPackets; i++){
                    filteredArrray.push('milk')
                  }
                  
                  newArrray.push(...filteredArrray)
              })
              
             const filteredNewArray =  newArrray.map((food)=> {return food.trim()})
              const foodObj = filteredNewArray.reduce((result, food) => {
                  if (food!== '') { // Check if food is not an empty string
                    if (!result[food]) {
                      result[food] = 1; // Initialize count to 1 for the first occurrence
                    } else {
                      result[food]++; // Increment count for subsequent occurrences
                    }
                  }
                  return result;
                }, {});
          
                let foodCountArray = []
                
                // Convert the result object to an array of objects
                foodCountArray = Object.keys(foodObj).map((foodName) => ({
                  food: foodName,
                  count: foodObj[foodName],
                }));

            tableData.lastModified = getDate();
            tableData.totalizer.totalPackets += workerObj.totalPackets
            tableData.totalizer.totalPlates = newWorkersArray.length
            tableData.totalizer.foodCountArray = foodCountArray
        
              // Save the updated table data back to Firestore
              await setDoc(tableDocRef, tableData);
              console.log('Table document updated:', tableDocRef.id);
              dispatch(initialWorkers(filter, uid, tableName))
              toast.success('successfully added worker')
              setIsSubmitting(false)
            } else {
              console.log('Table document does not exist.');
              setIsSubmitting(false)
            }

          } catch (error) {
            console.error('Error updating table document:', error);
            toast.error(error.message)
            setIsSubmitting(false)

          }

    }

    const toggleOrderByBox = ()=>{
        if(editingWorker) return
        setOpeningOrderBox((prevState)=> !prevState)
        document.addEventListener('click', (e)=>{

            if(!e.target.closest('.filter-by.second') && !e.target.matches('.orderby')){

                setOpeningOrderBox(false)

            }
        })
        setOpeningSortingBox(false)
    }
    const toggleSortByBox = ()=>{
        if(editingWorker) return
        setOpeningSortingBox((prevState)=> !prevState)
        document.addEventListener('click', (e)=>{

            if(!e.target.closest('.filter-by.first') && !e.target.matches('.sortby')){

                setOpeningSortingBox(false)

            }
        })
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

    const scrollBarRef = useRef()
    const leftSliderRef = useRef()
    const rightSliderRef = useRef()

    const handlescroll = () => {
        const isAtBeginning = scrollBarRef.current.scrollLeft === 0;
        const isAtEnd = scrollBarRef.current.scrollLeft + scrollBarRef.current.clientWidth === scrollBarRef.current.scrollWidth;
      
        if (isAtBeginning) {
            leftSliderRef.current.classList.add('hide');
            rightSliderRef.current.classList.remove('hide');
        } else if (isAtEnd) {
          leftSliderRef.current.classList.remove('hide');
          rightSliderRef.current.classList.add('hide');
        } else {
          leftSliderRef.current.classList.remove('hide');
          rightSliderRef.current.classList.remove('hide');
        }

        if(scrollBarRef.current.clientWidth === scrollBarRef.current.scrollWidth){
          leftSliderRef.current.classList.add('hide');
          rightSliderRef.current.classList.add('hide');
      };
    }

    const moveLeft = ()=>{
        scrollBarRef.current.scrollLeft -= 200
    }

    const moveRight = ()=>{
        scrollBarRef.current.scrollLeft += 200;
    }

   

    return(
        <div className="slider-container">
         <div className="slide left-container" ref={leftSliderRef} onClick={moveLeft}>
            <NavigateBackArrow/>
        </div>
        <div className="page-manager-upper" onScroll={handlescroll} ref={scrollBarRef}>
       
        <div className="right-upper">
            <button className="left-upper" onClick={navigateBack}>
                <NavigateBackArrow/>
                <p>Back</p>
            </button>
            <div className="vertical-separator">
                <div className="vertical-separator-inner"></div>
            </div>
          
            <button onClick={reloadData}><Refresh/> reload</button>
            
            <div>
                <button title={`${editingWorker ? 'not active on this page' : ''}`} className={`button-toggle dropdown sortby ${editingWorker ? 'not-active' : ''}`} onClick={toggleSortByBox}><SortBy/>  Sort by  <NavigateBackArrow/> </button>
                { openSortingBox && <SortByBox openSortingBox={openSortingBox}/>}
            </div>
            
            <div >
                <button title={`${editingWorker ? 'not active on this page' : ''}`} className={`button-toggle dropdown orderby ${editingWorker ? 'not-active' : ''} ${sortOrder === 'ascending' ? 'ascending' : ''}`} onClick={toggleOrderByBox}><OrderBy/> Sort order <NavigateBackArrow/></button>
                {openOrderBox && <OrderByBox openOrderBox={openOrderBox}/>}
            </div>
         
           
            <button className={`${individualTable ? '' : 'not-active'}`} onClick={toggleAddingWorkerModal} title={`${individualTable ? '' : 'not active on this page'}`}><AddPerson/>  Add person</button>
          
           
            
            </div>
            
            <div className={`search-container ${editingWorker ? 'not-active' : ''}`}>
                <Search/>
                <input type="search" name="searchparams" placeholder="search table or person" onChange={handleChange}/>
                
            </div>

        </div>
        <div className="slide right-container" ref={rightSliderRef} onClick={moveRight}>
            <NavigateBackArrow/>
        </div>
        {addingWorker &&
        <AddingWorker toggleAddingWorkerModal={toggleAddingWorkerModal} addWorker={addWorker} isSubmitting={isSubmitting}/>
            }


        </div>
    )
}
