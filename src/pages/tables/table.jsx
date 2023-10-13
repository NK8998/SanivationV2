
import { useEffect } from "react"
import "./table.css"
import { useFilterContext } from "../../utilites/filter-context"
import { useDispatch, useSelector } from "react-redux"
import { initialWorkers, removeWorkerFromArray } from "../../store/table-slice"
import { Link, useParams } from "react-router-dom"
import { TrashIcon } from "../../assets/icons"
export default function Table(){

    const {setIndividualTable, filterRouteData, setTableName, sortOrder, sortBy} = useFilterContext()
    const tableData = useSelector((state)=> state.table.tableData)
    const userData = useSelector((state)=> state.auth.userData)
    const loading = useSelector((state)=> state.table.loading)
    const {uid} = userData
    const dispatch = useDispatch()
    const {tableName} = useParams()
  

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

    const removeWorker = async (e, workerID)=>{
      
        e.stopPropagation()
        e.preventDefault()

        dispatch(removeWorkerFromArray(uid, tableName, workerID))
    }  

    

    const sortedWorkers = filterRouteData(tableData.workers)

    const workersEl = sortedWorkers.map((worker)=>{

        return (
            <>
            <p className="date"></p>
            <div className="table-wrapper">
            <Link to={`/${tableName}/${worker.ID}`} key={worker.ID}>
                <div className="table last">
                        <div className="name-and-title">
                                <div className="listname" title={tableData?.listName || 'generic'}>{tableData?.listName && tableData?.listName[0] || 'T'}</div>
                                <p >{worker.worker || worker.listworker}</p>
                        </div>
                    <p >{worker.ID}</p>
                    <p >{worker.createdAt}</p>
                    <p >{worker.lastModified}</p>
                    <p  className="remove" onClick={(e)=>{removeWorker(e, worker.ID)}}><TrashIcon/></p>
                </div>
            </Link>
            </div>
            </>
        )

    })


    return(
        <div className="chosen-table">
           {loading ? <p>Loading...</p> : workersEl}

        </div>
    )
}