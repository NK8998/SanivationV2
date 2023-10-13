import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { handleSubmitOrdersThunk } from "../../../store/worker-slice"

export default function EditOrder({workerID, tableData, startEditingOrders}){

    const workerData = useSelector((state)=>state.worker.workerData)
    const userData = useSelector((state)=> state.auth.userData)
    const {uid} = userData
    const dispatch = useDispatch()

    const handleSubmitOrders = (e)=>{
        e.preventDefault()
        dispatch(handleSubmitOrdersThunk(e, uid, workerID, tableData))
    }
    return(
        <form onSubmit={(e)=>handleSubmitOrders(e)}>
            <p className="top-form">*separate each order with a comma*</p>
            <div className="form-middle">
                <input type="text" name="editedOrders" placeholder="edit order" defaultValue={workerData?.foodOrdered}/>
            </div>

            <div className="bottom-buttons">
                <button type="button" onClick={startEditingOrders}>Cancel</button>
                <button type="submit">Update</button>
            </div>
        </form>

    )
}