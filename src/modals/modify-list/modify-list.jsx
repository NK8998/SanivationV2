import { useEffect, useState } from "react"
import "./modify-list.css"
import { useDispatch, useSelector } from "react-redux"
import { addWorkerThunk, filterAllFIeldIDs, getUserListsThunk, revertAllFieldsIDs, revertLoading, toggleWorkerModal, updateAllFieldIDs, updateChosenList, updateChosenWorker } from "../../store/modals-slices/modify-list-slice"
import { DynamicFieldsMoify } from "./dynamic-fields-modify/dynamic-fields-modify"
import { getDate } from "../../utilites/get-date"
import { toggleOpenListModifier } from "../../store/modals-slices/all-modals-controller"
import { RemoveWorkerModal } from "./remove-worker/remove-worker"
import AllListsModify from "./all-lists-modify/all-lists-modify"
import { nanoid } from "nanoid"

export default function ModifyList(){
    const dispatch = useDispatch()

    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const chosenList =  useSelector((state)=> state.modifyList.chosenList)
    const chosenWorker =  useSelector((state)=> state.modifyList.chosenWorker)
    const removingWorkerModal =  useSelector((state)=> state.modifyList.removingWorkerModal)

    useEffect(()=>{

        return()=>{
          dispatch(revertLoading())
            dispatch(revertAllFieldsIDs())
        }

    }, [])

    const [allFieldsIDs, setAllFieldsIDs] = useState([]);

    const addFields = () => {
      const uniqueID = nanoid(4);
      setAllFieldsIDs((prevFields) => [...prevFields, uniqueID]);
    };
    
    
    const removeFields = (e) => {
      const dataIndex = e.target.getAttribute('dataindex');
      console.log(dataIndex);
      setAllFieldsIDs((prevElements) =>
        prevElements.filter((element) => element !== dataIndex)
      );
    };
    
 



    
    const dynamicFieldsToBeRendered = allFieldsIDs.map((uniqueID) => {
      return (
        <DynamicFieldsMoify
          key={uniqueID}
          dataindex={uniqueID}
          removeFields={removeFields}
        />
      );
    });

    const toggleRemovingWorker = (worker)=>{
        dispatch(toggleWorkerModal())
        dispatch(updateChosenWorker(worker))
    }

    const listContent = chosenList.workers?.map((worker)=>{
    
        return(
            <div className="worker-container" onClick={()=>{toggleRemovingWorker(worker.listworker)}} key={worker.ID}>
            <p>{worker.listworker}</p>
            
            <p>Remove</p>
            </div>
        )
        })
        
    
    const removeWorker = (worker)=>{

        let newChosenListObj = {...chosenList}
        newChosenListObj.workers = newChosenListObj.workers.filter((worker)=>worker.listworker !== chosenWorker)
 
        console.log(newChosenListObj)
 
        dispatch(updateChosenList(newChosenListObj))
        dispatch(toggleWorkerModal())
 
 
 
    }

    const addWorkers = (e)=>{

      e.preventDefault()
      dispatch(addWorkerThunk(e, chosenList, uid))
      setAllFieldsIDs([])
    }
    

    return(

        <>
        <div className="auto-bg-black" onClick={()=>{dispatch(toggleOpenListModifier())}}></div>

        <div className="modal-container">
        <div className="upper-modal">
              <p>All your lists can be modified from here</p>
              <p><b>current list: </b>{chosenList?.listName || ''}</p>
            </div>

            <div className="all-workers-container">
                <p className="top-p">Current Workers on list:</p>
                {listContent}

              </div>

            <form onSubmit={(e)=>{addWorkers(e)}}>
                <p className="adding-workers-top">Add more workers:</p>
                <div className="adding-workers-containers">
                  {dynamicFieldsToBeRendered}
                </div>
            
                <div className="addplus" onClick={addFields}>add <p>Add field </p></div>

                <div className="modal-bottom">
                    <button className="left-button" onClick={()=>{dispatch(toggleOpenListModifier())}}>Cancel</button>
                    <button className="right-button">Save</button>
                </div>
            </form>

            <AllListsModify/>
            {/* buttons to open lists drawer should slide from bottom */}
            {removingWorkerModal && <RemoveWorkerModal removeWorker={removeWorker} toggleRemovingWorker={toggleRemovingWorker}/>}
        </div>
        </>
    )
}