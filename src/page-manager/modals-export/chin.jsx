import { useDispatch, useSelector } from "react-redux"
import { AddTable, CreateList, EditList, PlusIcon } from "../../assets/icons"
import { toggleOpenAutoTable, toggleOpenListModifier, toggleOpenLists, toggleopenGenericTable } from "../../store/modals-slices/all-modals-controller"

export default function Chin(){
    const dispatch = useDispatch()

    const openAutoTable = useSelector((state)=>state.allModalsController.openAutoTable)
    const openListModifier = useSelector((state)=>state.allModalsController.openListModifier)
    const openLists = useSelector((state)=>state.allModalsController.openLists)
    const openGenericTable = useSelector((state)=>state.allModalsController.openGenericTable)
    return(
        <div className="chin">
            <button onClick={()=>{dispatch(toggleOpenAutoTable())}} className={openAutoTable ? 'chin-button-active' : ''}><PlusIcon/></button>
            <button onClick={()=>{dispatch(toggleOpenLists())}} className={openLists ? 'chin-button-active' : ''}><CreateList/></button>
            <button onClick={()=>{dispatch(toggleOpenListModifier())}} className={openListModifier ? 'chin-button-active' : ''}><EditList/></button>
            <button onClick={()=>{dispatch(toggleopenGenericTable())}} className={openGenericTable ? 'chin-button-active' : ''}><AddTable/></button>
        </div>
    )
}