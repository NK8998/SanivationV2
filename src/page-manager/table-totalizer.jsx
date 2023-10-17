import { useSelector } from "react-redux"
import { useFilterContext } from "../utilites/filter-context"
import { CloseEx } from "../assets/icons"

export default function TableTotalizer({showTableData, setShowTableData}){

    const tableData = useSelector((state)=> state.table.tableData)

    if(Object.entries(tableData).length < 2){
        return(
            <></>
        )
   }
  
    return(
        <>
        <div className={`totalizer-bg-black ${showTableData ? 'show': ''}`} onClick={()=>setShowTableData((prevState)=>!prevState)}></div>
        <div className={`table-data right-side ${showTableData ? 'show': ''}`}>
            <button className="close-button" onClick={()=>setShowTableData((prevState)=>!prevState)}><CloseEx/></button>
            <div className="table-name-totalizer">
                <p>{tableData.tableName.split('_')[0]} data</p>
            </div>
            <div className="top-totalizer">
                <p>Total plates: <span>{tableData.totalizer.totalPlates}</span></p>
                <p>Total packets: <span>{tableData.totalizer.totalPackets}</span></p>
            </div>
            <div className="dates">
                <p>Created at: <span>{tableData.createdAt}</span></p>
                <p>Last Modified: <span>{tableData.lastModified}</span></p>
            </div>
        </div>
        </>
    )
}