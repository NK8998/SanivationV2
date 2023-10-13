import { useEffect } from "react"
import { useFilterContext } from "../../utilites/filter-context"
import { useLocation, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"


export default function OrderByBox(){

    const {sortOrder, setSortOrder, filterRouteData, tableName} = useFilterContext()
  
    return(
        <div className="filter-by second">
             <div className="options" onClick={()=>{setSortOrder('ascending')}}><div className="icon-container">{sortOrder === 'ascending' && 'c'}</div>Ascending</div>
             <div className="options" onClick={()=>{setSortOrder('descending')}}><div className="icon-container">{sortOrder === 'descending' && 'c'}</div>Descending</div>
        </div>
    )
}