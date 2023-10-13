import { useDispatch, useSelector } from "react-redux"
import AllLists from "./all-lists-auto/all-lists-auto"
import "./auto-table.css"
import { useEffect, useRef, useState } from "react"
import { generateTableThunk, toggleFoodPicker_, updateCurrentWorker } from "../../store/modals-slices/auto-table-slice"

import { toggleOpenAutoTable } from "../../store/modals-slices/all-modals-controller"
import FoodPicker from "./food-picker/food-picker"
import AllListsAuto from "./all-lists-auto/all-lists-auto"
import { AddPlusIcon, ToggleListsIcon, TrashIcon } from "../../assets/icons"
import Totalizer from "./totalizer/totalizer"


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
    const timeoutRef = useRef()
    useEffect(()=>{

        // get user list 
  

    }, [])

    const toggleFoodPicker=(worker)=>{
        dispatch(toggleFoodPicker_())
        dispatch(updateCurrentWorker(worker))

    }

    const filteredWorkers = chosenList.workers?.filter((worker)=>
    worker.listworker.toLowerCase().includes(filter.toLowerCase())
    )

    const listContent = filteredWorkers.map((worker)=>{
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
                <div className="worker-and-food-inner" onClick={()=>{toggleFoodPicker(worker)}}>
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
                <p><AddPlusIcon/></p>
                </div>

                {removedWorker ?
                    <p onClick={()=>addWorkersBackToList(worker.ID)}>undo</p>
                    :
                    <p onClick={()=>removeWorkersFromList(worker.ID)}><TrashIcon/></p>
                }
            </div>
            // onclick should activate food picker
        )
      })

      const generateTable = ()=>{
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

   
    return(
        <>
            <div className="auto-bg-black" onClick={toggleAutoTable}></div>
            <div className="modal-container">
                <div className="modal-inner">
                <div className="top-section">
                    <p>Add Table</p>
                    <div className="flexy">
                    <p>current list: {chosenList.listName}</p>
                    <input type="text" name="filterworkers" onChange={(e)=>handleChange(e)} placheholder="search for worker"/>

                    <button className="toggle-totalizer" onClick={()=>{setTotalizerOpen((prevState)=>!prevState)}}>see total</button>
                    </div>
                </div>
                <div className="all-workers-container">
                    {listContent}
                </div>
                <div className="modal-bottom">
                    <button className="left-button" onClick={toggleAutoTable}>Cancel</button>
                    <button className="right-button" onClick={generateTable}>Save</button>
                </div>
                <Totalizer setTotalizerOpen={setTotalizerOpen} totalizerOpen={totalizerOpen} removedWorkerIDs={removedWorkerIDs}/>
            <div className="secondary-chin" onClick={()=>{setShowLists((prevState)=>!prevState)}}>
                <button className="lists-toggle" ><ToggleListsIcon/></button>
            </div>
      
            <AllListsAuto showLists={showLists} setShowLists={setShowLists}/>
            </div>
            </div>
            <FoodPicker toggleFoodPicker={toggleFoodPicker}/>
    
        </>
    )
}