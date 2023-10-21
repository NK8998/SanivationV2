
import { useEffect, useState } from "react"
import "./table.css"
import { useFilterContext } from "../../utilites/filter-context"
import { useDispatch, useSelector } from "react-redux"
import { initialWorkers, removeWorkerFromArray } from "../../store/table-slice"
import { Link, useLocation, useParams } from "react-router-dom"
import { TrashIcon } from "../../assets/icons"
import RemoveWorkerModal from "./modal"
export default function Table(){

    const {setIndividualTable, filterRouteData, setTableName, sortOrder, sortBy} = useFilterContext()
    const tableData = useSelector((state)=> state.table.tableData)
    const userData = useSelector((state)=> state.auth.userData)
    const loading = useSelector((state)=> state.table.loading)
    const {uid} = userData
    const dispatch = useDispatch()
    const {tableName} = useParams()

    const [removeWorkerModal, setRemoveWorkerModal] = useState(false)
    const [currentWorker, setCurrentWorker] = useState({})

  

    useEffect(()=>{

        dispatch(initialWorkers('', uid, tableName))
        setIndividualTable(true)

        setTableName(tableName)

      
        return()=>{
            setIndividualTable(false)
            setTableName('')
        }
    }, [])

  
    useEffect(()=>{

    }, [sortOrder, sortBy])

    const removeWorker = async ()=>{
      

        dispatch(removeWorkerFromArray(uid, tableName, currentWorker.ID))

        setRemoveWorkerModal(false)
    }  

    const toggleWorkerModal = (e, workerObj)=>{
        
        e.stopPropagation()
        e.preventDefault()

        setCurrentWorker(workerObj)
        setRemoveWorkerModal((prevState)=>!prevState)

    }
    

    const sortedWorkers = filterRouteData(tableData.workers)

    const workersEl = sortedWorkers.map((worker)=>{

        const foodOrderedEl = worker.foodOrdered.map((food, index)=>{
            return(
                <span key={index} className="food-categories">{food}</span>
            )
        })
        return (
            <div key={worker.ID}>
            <p className="date"></p>
            <div className="table-wrapper">
            <Link to={`/${tableName}/${worker.ID}`} key={worker.ID} className={`month table last`}>
            <div className="listname outer" title={tableData?.listName || 'generic'}>{tableData?.listName && tableData?.listName[0] || 'T'}</div>

                <div className="months-table  last">
                        <div className="name-and-title">
                                <div className="listname inner" title={tableData?.listName || 'generic'}>{tableData?.listName && tableData?.listName[0] || 'T'}</div>
                                <p ><span>Name</span>{worker.worker || worker.listworker}</p>
                        </div>
                    <p className="dad-wish">
                    <span>Food ordered</span>
                    <span className="food-ordered-drawer">
                        {foodOrderedEl}
                    </span>
                    </p>
                    <p ><span>Worker ID</span>#{worker.ID}</p>
                    <p className="irrelevant"><span>Created at</span>{worker.createdAt}</p>
                    <p className="irrelevant"><span>Last modified</span>{worker.lastModified}</p>
                    <p  className="remove inner" onClick={(e)=>{toggleWorkerModal(e, worker)}}><TrashIcon/></p>
                </div>
            </Link>
            <p  className="remove outer" onClick={(e)=>{toggleWorkerModal(e, worker)}}><TrashIcon/></p>

            </div>
            </div>
        )

    })


    return(
        <div className="chosen-table">
           {loading ? <p>Loading...</p> : workersEl}

        {removeWorkerModal && <RemoveWorkerModal setRemoveWorkerModal={setRemoveWorkerModal} removeWorker={removeWorker} currentWorker={currentWorker}/> }
        </div>
    )
}