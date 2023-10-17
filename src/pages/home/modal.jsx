export default function RemoveTableModal({setRemoveTableModal, removeTable, currentTable}){
    return(
        <>
        <div className="bg-black-removing" onClick={()=>setRemoveTableModal((prevState)=>!prevState)}></div>
        <div className="remove-worker">
        <p>Are you sure you want to remove <span>{currentTable.tableName.split('_')[0]}</span></p>

        <div className="modal-bottom">  
        <button onClick={()=>setRemoveTableModal((prevState)=>!prevState)}>Cancel</button>
        <button onClick={removeTable}>Remove</button>

        </div>
        </div>
        </>
    )
}