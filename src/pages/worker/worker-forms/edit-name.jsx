import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { handleSubmitNameThunk } from "../../../store/worker-slice"

export default function EditName({workerID, tableData, startEditingName}){

    const workerData = useSelector((state)=>state.worker.workerData)
    const userData = useSelector((state)=> state.auth.userData)
    const {uid} = userData

    const dispatch = useDispatch()


    const handleSubmitName = (e)=>{
        e.preventDefault()
        dispatch(handleSubmitNameThunk(e, uid, workerID, tableData))
    }
    return(
        <>
        <div className="adding-name-bg" onClick={startEditingName}></div>
        <form onSubmit={(e)=>handleSubmitName(e)} className="editing-name">
                <p className="top-form">*Changes for this field will take effect after refreshing*</p>
                <div className="form-middle">
                    <input type="text" name="editedName" placeholder="edit order" defaultValue={workerData?.worker || workerData?.listworker}/>
                </div>

                <div className="modal-bottom">
                    <button type="button" onClick={startEditingName}>Cancel</button>
                    <button type="submit">Update</button>
                </div>
        </form>   
        </>       

    )
}