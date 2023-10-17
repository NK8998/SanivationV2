export default function RemoveWorkerModal({setRemoveWorkerModal, removeWorker, currentWorker}){
    return(
        <>
        <div className="bg-black-removing" onClick={()=>setRemoveWorkerModal((prevState)=>!prevState)}></div>
        <div className="remove-worker">
        <p>Are you sure you want to remove <span>{currentWorker.listworker}</span></p>

        <div className="modal-bottom">  
        <button onClick={()=>setRemoveWorkerModal((prevState)=>!prevState)}>Cancel</button>
        <button onClick={removeWorker}>Remove</button>

        </div>
        </div>
        </>
    )
}