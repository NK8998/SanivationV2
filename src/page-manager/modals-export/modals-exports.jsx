import ModifyList from "../../modals/modify-list/modify-list"
import AddList from "../../modals/add-list/add-list"
import AutoTable from "../../modals/auto-table/auto-table"
import GenericTable from "../../modals/generic-table/generic-table"
import "./modals.css"
import Chin from "./chin"
import { useSearchParams } from "react-router-dom"

export default function ModalsExport({}){


    const [searchParams, setSearchParams] = useSearchParams();
    const modal = searchParams.get('modal')

    return(

        
        modal  && 
        <>
        <div className="modals-bg-close" onClick={()=>setSearchParams('')}></div>
        <div className='modals-wrapper'>
        <>
        { modal === 'generic' && <GenericTable />}
        {modal === 'add-list' && <AddList />}
        {modal === 'modify-list' && <ModifyList />}
        {modal === 'auto-table' && <AutoTable/>}
        </>
        <Chin />
        </div>
        </>
    
    )
}