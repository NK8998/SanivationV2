import { useEffect } from "react"
import { useFilterContext } from "../../utilites/filter-context"
import { Selected } from "../../assets/icons"

export default function SortByBox(){

    const{sortBy, setSortBy} = useFilterContext()

 
    return(
        <div className="filter-by first">
            <div className="options" onClick={()=>{setSortBy('name')}}><div className="icon-container">{sortBy === 'name' && <Selected/>}</div>Name</div>
            <div className="options" onClick={()=>{setSortBy('created')}}><div className="icon-container">{sortBy === 'created' && <Selected/>}</div>Time created</div>
            <div className="options" onClick={()=>{setSortBy('modified')}}><div className="icon-container">{sortBy === 'modified' && <Selected/>}</div>Time modified</div>
        </div>
    )
}