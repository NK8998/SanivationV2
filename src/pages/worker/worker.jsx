import { useEffect, useState } from "react"
import "./worker.css"
import { useFilterContext } from "../../utilites/filter-context"
import { useDispatch, useSelector } from "react-redux"
import { fetchWorkerData } from "../../store/worker-slice"
import EditName from "./worker-forms/edit-name"
import EditOrder from "./worker-forms/edit-order"
import { useLocation, useParams } from "react-router-dom"
import { AccountCircle, DrinksIcon, EditIcon, EditList, MainFoodIcon, SupplementFoodIcon } from "../../assets/icons"

export default function Worker(){
    const {setEditingWorker} = useFilterContext()

    const userData = useSelector((state)=> state.auth.userData)
    const {uid} = userData
    const{workerID, tableName} = useParams()

  
    const workerData = useSelector((state)=>state.worker.workerData)
    const tableData = useSelector((state)=>state.worker.tableData)
    const updateWorker = useSelector((state)=>state.worker.updateWorker)

    const [editingOrders, setEditingOrders] = useState(false)
    const [editingName, setEditingName] = useState(false)

    const {setTableName, setWorkerID} = useFilterContext()
   
    const dispatch = useDispatch()


    

    useEffect(()=>{

        dispatch(fetchWorkerData(workerID, uid, tableName))

        setEditingWorker(true)
        setTableName(tableName)
        setWorkerID(workerID)

        return()=>{
            setEditingWorker(false)
        }

    }, [])

    useEffect(()=>{

        // updateWorker
        dispatch(fetchWorkerData(workerID, uid, tableName))

    }, [updateWorker])

    const startEditingOrders = ()=>{
        setEditingOrders((prevState)=>!prevState)
        setEditingName(false)
    }

    const startEditingName = ()=>{
        setEditingName((prevState)=>!prevState)
        setEditingOrders(false)

    }

    const workerDataEl = workerData?.foodOrdered?.map((food, index)=>{

        let type;
        let icon;
        if( index === 0){
            type = 'main' 
            icon = <MainFoodIcon/>
        }else if(index === 1){
            type = 'supplement'
            icon = <SupplementFoodIcon/>
        }else if(index === 2){
            type = 'greens'
            icon = <SupplementFoodIcon/>
        }else if(index === 3){
            type = 'drink'
            icon = <DrinksIcon/>
        }
      
        return(
            <div className="food-picked" >
                  <p>{type}</p>
                <div className=" pick">
                    {icon}
                  
                    {food}
                </div>
            </div>
        )
    })

    return(
        <div className="chosen-worker">
            <div className="chosen-worker-start">
                <div className="top-section-chosen-worker">
                <p className="editable-top">click to edit <EditIcon/></p>
                </div>
                <div className="left">
                    <div className="worker-left general" onClick={startEditingName}>
                        <p className="title-of-worker">Name</p>
                        <div className=" editable-field" ><AccountCircle/><p>{workerData?.worker || workerData?.listworker}</p></div>
                   
                    </div>
                    <div className="worker-middle general">
                    <p className="title-of-worker">Food</p>
                        <div className="all-foods-container" onClick={startEditingOrders}>
                        {workerDataEl}
                        </div>
                      
                    </div>
                
                </div>
            </div>
            {editingName && <EditName workerID={workerID} tableData={tableData} startEditingName={startEditingName}/>}
            {editingOrders && <EditOrder workerID={workerID} tableData={tableData} startEditingOrders={startEditingOrders}/>}
            <div className="worker-end ">
                <div className="editable-top">
                    Date
                </div>
                <div className="date-lower">
                    <p><span>created at:</span> {workerData?.createdAt}</p>
                    <p><span>last modified: </span>{workerData?.lastModified}</p>
                </div>
            </div>
        </div>
    )

}