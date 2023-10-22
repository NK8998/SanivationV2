import ModifyList from "../../modals/modify-list/modify-list"
import AddList from "../../modals/add-list/add-list"
import AutoTable from "../../modals/auto-table/auto-table"
import GenericTable from "../../modals/generic-table/generic-table"
import "./modals.css"
import Chin from "./chin"
import { useSearchParams } from "react-router-dom"
import { CloseEx } from "../../assets/icons"

export default function ModalsExport({}){


    const [searchParams, setSearchParams] = useSearchParams();

    const updateModal = (modalValue) => {
        // Create a new search parameters object and set the 'modal' parameter to the new value
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('modal', modalValue);
      
        // Replace the entire search parameters with the updated one
        setSearchParams(newSearchParams, {replace: true});
      };
    const modal = searchParams.get('modal')

    return(

        
        modal  && 
        <>
        <div className="modals-bg-close" onClick={()=>updateModal('')}></div>
        <div className='modals-wrapper'>
            <div className="modals-content">
            <button className="close-modals"onClick={()=>updateModal('')}><CloseEx/>close</button>
            <>
            { modal === 'generic' && <GenericTable />}
            {modal === 'add-list' && <AddList />}
            {modal === 'modify-list' && <ModifyList />}
            {modal === 'auto-table' && <AutoTable/>}
            </>
            </div>
            <Chin />
        </div>
        </>
    
    )
}