import { useSelector } from "react-redux"
import ModifyList from "../../modals/modify-list/modify-list"
import AddList from "../../modals/add-list/add-list"
import AutoTable from "../../modals/auto-table/auto-table"
import GenericTable from "../../modals/generic-table/generic-table"
import "./modals.css"
import Chin from "./chin"

export default function ModalsExport(){

    const openLists = useSelector((state)=> state.allModalsController.openLists)
    const openListModifier = useSelector((state)=> state.allModalsController.openListModifier)
    const openAutoTable = useSelector((state)=> state.allModalsController.openAutoTable)
    const openGenericTable = useSelector((state)=> state.allModalsController.openGenericTable)


    return(
        <div className="modals-wrapper">
        <>
        {openGenericTable && <GenericTable />}
        {openLists && <AddList />}
        {openListModifier && <ModifyList />}
        {openAutoTable && <AutoTable/>}
        </>
        {(openGenericTable || openLists || openListModifier || openAutoTable) && <Chin/>}
        </div>
    )
}