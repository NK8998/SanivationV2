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
import { AccountCircle, AddPlusIcon, MenuDropDown, ToggleListsIcon, TrashIcon } from "../../assets/icons"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"
import ListContent from "./list-content"

export default function ModifyList(){

    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()

    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const chosenList =  useSelector((state)=> state.modifyList.chosenList)
    const chosenWorker =  useSelector((state)=> state.modifyList.chosenWorker)
    const removingWorkerModal =  useSelector((state)=> state.modifyList.removingWorkerModal)
    const isSubmitting = useSelector((state)=>state.modifyList.isSubmitting)
    

    const [showLists, setShowLists] = useState(false)

    const [addingWorkersModal, setAddingWorkersModal] = useState(false)

   

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

    const updateWorkerType = (chosenWorker, type)=>{

      let newChosenListObj = {...chosenList}

      newChosenListObj.workers = newChosenListObj.workers.map((worker)=>{
        if(worker.ID === chosenWorker.ID){
          return {...worker, type:type}
        }
        return worker
      })

      dispatch(updateChosenList(newChosenListObj))


    }

    

   
    const listContent = chosenList.workers?.map((worker)=>{
        return(
          <ListContent worker={worker} updateWorkerType={updateWorkerType} toggleRemovingWorker={toggleRemovingWorker}/>
        )
        })
        
    
    const removeWorker = (worker)=>{

        let newChosenListObj = {...chosenList}
        newChosenListObj.workers = newChosenListObj.workers.filter((worker)=>worker.ID !== chosenWorker.ID)
 
        console.log(newChosenListObj)
 
        dispatch(updateChosenList(newChosenListObj))
        dispatch(toggleWorkerModal())
 
 
 
    }

    const addWorkers = (e)=>{
      e.preventDefault()

      const formData = new FormData(e.target);

      if(!chosenList || Object.entries(chosenList).length === 0){
        toast.error('please select a list ')
      }else{
        dispatch(addWorkerThunk(e, chosenList, uid))
        setAllFieldsIDs([])
      }

   
    }
    
    const updateModal = (modalValue) => {
      // Create a new search parameters object and set the 'modal' parameter to the new value
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('modal', modalValue);
    
      // Replace the entire search parameters with the updated one
      setSearchParams(newSearchParams, {replace: true});
    };

    return(

        <>
        <div className="modal-container modifying">
            <div className="top-section modifying">
              <p>All your lists can be modified from here</p>
              <p className="list-head">current list: <span>{chosenList?.listName || ''}</span></p>
            </div>

            <div className="all-workers-container modifying">
                <p className="top-p">Current Workers on list:</p>
                {listContent} 
                <form onSubmit={addWorkers}>
                  <div className="dynamic-container-modify">
                  {dynamicFieldsToBeRendered}
                  </div>
                { (!chosenList || Object.entries(chosenList).length < 2) ? <></> : <div className="addplus" onClick={addFields}><AddPlusIcon/><p>Add field </p></div>}
              
                <div className="secondary-chin">

                  <button className="left-button" type="button"  onClick={()=>updateModal('')}>Cancel</button>
                  <button className="lists-toggle" type="button" onClick={()=>{setShowLists((prevState)=>!prevState)}}><ToggleListsIcon/>{(!chosenList || Object.entries(chosenList).length < 2) ? <p>Select list</p> : (<p>: {chosenList?.listName}</p> || '')}</button>
                  
                  {isSubmitting ?
                    <button className="right-button loading"><div className="loader"></div></button>
                    :
                    <button className="right-button">Save</button>}

                </div>
                </form>


              </div>


           
            <AllListsModify showLists={showLists} setShowLists={setShowLists}/>
            {/* buttons to open lists drawer should slide from bottom */}
            {removingWorkerModal && <RemoveWorkerModal removeWorker={removeWorker} toggleRemovingWorker={toggleRemovingWorker}/>}
        </div>
        </>
    )
}