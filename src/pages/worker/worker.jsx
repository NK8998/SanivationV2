import { useEffect, useState } from "react"
import "./worker.css"
import { useFilterContext } from "../../utilites/filter-context"
import { useDispatch, useSelector } from "react-redux"
import { fetchWorkerData } from "../../store/worker-slice"
import EditName from "./worker-forms/edit-name"
import EditOrder from "./worker-forms/edit-order"
import { useParams } from "react-router-dom"
import { EditIcon, EditList } from "../../assets/icons"

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

    return(
        <div className="chosen-worker">
            <div className="chosen-worker-start">
                <div className="top-section-chosen-worker">
                <p className="editable-top">click to edit <EditIcon/></p>
                </div>
                <div className="left">
                    <div className="worker-left general">
                        <p>Name</p>
                        <p className=" left editable-field" onClick={startEditingName}>{workerData?.worker || workerData?.listworker}</p>
                        {editingName && <EditName workerID={workerID} tableData={tableData} startEditingName={startEditingName}/>}
                    </div>
                    <div className="worker-middle general">
                        <p>Food</p>
                        <p className="right editable-field " onClick={startEditingOrders}>{workerData?.foodOrdered}</p>
                        {editingOrders && <EditOrder workerID={workerID} tableData={tableData} startEditingOrders={startEditingOrders}/>}
                    </div>
                
                </div>
            </div>
           
            <div className="worker-end ">
                <p>created at: {workerData?.createdAt}</p>
                <p>last modified: {workerData?.lastModified}</p>
            </div>
        </div>
    )

}