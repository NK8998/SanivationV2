import { useSelector } from "react-redux"

export function RemoveWorkerModal({removeWorker, toggleRemovingWorker}){

    const chosenWorker = useSelector((state)=> state.modifyList.chosenWorker)
    
    return(
        <>
    <div className="auto-bg-black removing" onClick={()=>{toggleRemovingWorker('')}}></div>
    <div className="removing-worker">
         <div className="upper-modal">
          <p>Removing worker!!</p>
         </div>
          <p className="removing-line">Are you sure you want to remove <span>{chosenWorker}</span></p>
         <div className="modal-bottom">
                <button className="left-button" onClick={()=>{toggleRemovingWorker('')}}>Cancel</button>
                <button className="right-button" onClick={()=>{removeWorker(chosenWorker)}}>Remove</button>
          </div>

    </div>
        </>
    )
}