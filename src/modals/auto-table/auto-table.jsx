import { useDispatch, useSelector } from "react-redux"
import AllLists from "./all-lists-auto/all-lists-auto"
import "./auto-table.css"
import { useEffect, useRef, useState } from "react"
import { generateTableThunk, toggleFoodPicker_, updateCurrentWorker } from "../../store/modals-slices/auto-table-slice"

import { toggleOpenAutoTable } from "../../store/modals-slices/all-modals-controller"
import FoodPicker from "./food-picker/food-picker"
import AllListsAuto from "./all-lists-auto/all-lists-auto"
import { AddPlusIcon, Search, ToggleListsIcon, TrashIcon } from "../../assets/icons"
import Totalizer from "./totalizer/totalizer"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"


export default function AutoTable(){
    const dispatch  = useDispatch()
    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const chosenList = useSelector((state)=>state.autoTable.chosenList)
    const totalizer = useSelector((state)=> state.autoTable.totalizer)
    
    const [showLists, setShowLists] = useState(false)
    const [totalizerOpen, setTotalizerOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [removedWorkerIDs, setRemovedWorkerIDs] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const timeoutRef = useRef()
 
    const toggleFoodPicker=(worker)=>{
        dispatch(toggleFoodPicker_())
        dispatch(updateCurrentWorker(worker))

    }

    const filteredWorkers = chosenList?.workers.filter((worker)=>
    worker.listworker.toLowerCase().includes(filter.toLowerCase())
    )

    const listContent = filteredWorkers?.map((worker)=>{
        const workerFoodOrderedEl = worker.foodOrdered.map((food)=>{
            return (
                <p key={worker.ID + food}>{food}</p>
            )
    })

       
    const removeWorkersFromList = (workerID)=>{
        setRemovedWorkerIDs(prevArray => [...prevArray, workerID])
        console.log('removed')
    }
    const addWorkersBackToList = (workerID)=>{
        setRemovedWorkerIDs(prevArray => prevArray.filter((ID)=> ID !== workerID))
    }

    const removedWorker = removedWorkerIDs.includes(worker.ID)

        return (
            <div className={`worker-and-food-outer ${removedWorker ? 'removed' : ''}`}  key={worker.ID}>
                <div className={`worker-and-food-inner ${removedWorker ? 'removed' : ''}`} onClick={()=>{toggleFoodPicker(worker)}}>
                <div className="left-side">
                    <p className="worker-name">{worker.listworker}:</p>  
                    <div className="food-picked">
                        <div className="food-picked-top">
                            <p>Main</p>
                            <p>Supplement</p>
                            <p>Greens</p>
                            <p>Drinks</p>
                        </div>
                        <div className="food-picked-bottom">
                            {workerFoodOrderedEl}
                        </div>
                    </div>
                </div>
                <p className="add-plus"><AddPlusIcon/></p>
                </div>

                {removedWorker ?
                    <p onClick={()=>addWorkersBackToList(worker.ID)}>undo</p>
                    :
                    <p className="remove-trash" onClick={()=>removeWorkersFromList(worker.ID)}><TrashIcon/></p>
                }
            </div>
            // onclick should activate food picker
        )
      })

      const generateTable = ()=>{
        if(!chosenList || Object.entries(chosenList).length < 2 ){
            toast.error('please select a list')
            return
        }
        const newChosenList =  {...chosenList}

        newChosenList.workers = newChosenList.workers.filter((worker)=> !removedWorkerIDs.includes(worker.ID))
        console.log(newChosenList)

        dispatch(generateTableThunk(uid, totalizer, newChosenList))

      }
      
      const toggleAutoTable = ()=>{
        dispatch(toggleOpenAutoTable())
      }

      const handleChange = (e)=>{
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(()=>{
            setFilter(e.target.value)
        })

      }

      const updateModal = (modalValue) => {
        // Create a new search parameters object and set the 'modal' parameter to the new value
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('modal', modalValue);
      
        // Replace the entire search parameters with the updated one
        setSearchParams(newSearchParams, {replace: true});
      };

   
    return(
        <>
            <div className="modal-container">
                <div className="modal-inner">
                <div className="top-section">
                    <p>Add Table</p>
                    <p className="list-head">current list: <span>{chosenList.listName}</span></p>
                    <div className="flexy">
                    <div className="input-container">
                      <Search />
                    <input type="text" name="filterworkers" onChange={(e)=>handleChange(e)} placheholder="search for worker"/>
                    </div>
                    <button className="toggle-totalizer" onClick={()=>{setTotalizerOpen((prevState)=>!prevState)}}>see total</button>
                    </div>
                </div>
                <div className="flexy-container-modal">
                    <div className="all-workers-container">
                        {listContent.length > 0  ? listContent : <p>Select a list</p>}
                    </div>
                    
                    <div className="secondary-chin " >
                        <button className="left-button " onClick={()=>updateModal('')}>Cancel</button>

                        <button className="lists-toggle" onClick={()=>{setShowLists((prevState)=>!prevState)}}><ToggleListsIcon/></button>

                        <button className="right-button" onClick={generateTable}>Save</button>

                    </div>
                </div>

            </div>
            <FoodPicker toggleFoodPicker={toggleFoodPicker}/>
            <AllListsAuto showLists={showLists} setShowLists={setShowLists}/>
            <Totalizer setTotalizerOpen={setTotalizerOpen} totalizerOpen={totalizerOpen} removedWorkerIDs={removedWorkerIDs}/>

            </div>
       
    
        </>
    )
}