import { useEffect } from "react"
import { useFilterContext } from "../../utilites/filter-context"

export default function SortByBox(){

    const{sortBy, setSortBy} = useFilterContext()

 
    return(
        <div className="filter-by first">
            <div className="options" onClick={()=>{setSortBy('name')}}><div className="icon-container">{sortBy === 'name' && 'c'}</div>Name</div>
            <div className="options" onClick={()=>{setSortBy('created')}}><div className="icon-container">{sortBy === 'created' && 'c'}</div>Time created</div>
            <div className="options" onClick={()=>{setSortBy('modified')}}><div className="icon-container">{sortBy === 'modified' && 'c'}</div>Time modified</div>
        </div>
    )
}