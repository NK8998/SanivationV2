import { useFilterContext } from "../../utilites/filter-context"
import "./header.css"
export default function Header(){

    const {individualTable, editingWorker} = useFilterContext()
    return(
        <div className="header">
            { !editingWorker &&
            <>
            <p></p>
            <p>{individualTable ?  'WORKER' : 'TABLE'} ID</p>
            <p>CREATED AT</p>
            <p>LAST MODIFIED</p>
            <p>ACTIONS</p>
            </>
            }
        </div>
    )
}