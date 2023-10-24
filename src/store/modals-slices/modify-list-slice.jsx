import {createSlice} from "@reduxjs/toolkit";
import { db } from "../../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid";
import { getDate } from "../../utilites/get-date";
import toast from "react-hot-toast";


const modifyListSlice = createSlice({
    name: 'modifyLists',
    initialState:{
        lists: [],
        chosenList: {},
        chosenWorker: '',
        removingWorkerModal: false,
        loading: true,
        error: '',
        allFieldsIDs: [],
        isSubmitting: false,

    },
    reducers:{
        updateLists:(state, action)=>{
            state.lists = action.payload
            state.loading = false
        },
        updateChosenList:(state, action)=>{
            state.chosenList = action.payload
        },
        updateChosenWorker:(state, action)=>{
            state.chosenWorker = action.payload
        },
        toggleWorkerModal:(state, action)=>{
            state.removingWorkerModal = !state.removingWorkerModal
        },
        revertLoading:(state, action)=>{
            state.loading = false
        },
        updateAllFieldIDs:(state, action)=>{
            state.allFieldsIDs = [...state.allFieldsIDs, ...action.payload]
        },
        filterAllFIeldIDs:(state, action)=>{
            const IdToBeRemoved = action.payload
            const IDArray = state.allFieldsIDs
            IDArray.filter((element) => element !== IdToBeRemoved)
            state.allFieldsIDs = IDArray

        },
        revertAllFieldsIDs:(state, action)=>{
            state.allFieldsIDs = []
        },
        toggleIsSubmitting:(state, action)=>{
          state.isSubmitting = !state.isSubmitting
        }
        
    }
})


export const {updateLists, updateChosenList, updateChosenWorker, toggleWorkerModal, revertLoading, revertAllFieldsIDs, updateAllFieldIDs, filterAllFIeldIDs, toggleIsSubmitting} = modifyListSlice.actions


export default modifyListSlice.reducer


export const getUserListsThunk = (uid)=>{

    return async(dispatch)=>{

        const userDocRef = doc(db, 'users', uid);
        const allListsRef = collection(userDocRef, 'lists');
        try {
          const allLists =  await getDocs(allListsRef)
         
      
          if (allLists) {
            const lists = allLists.docs.map((doc) => doc.data());
           
            dispatch(updateLists(lists))

          } else {
            console.log('List document does not exist.');
          }
       
        } catch (error) {
          console.error('Error fetching table document:', error);
          toast.error(error.message)
          // remeber to throw error
        }

    }

}

const modifyList = async (dispatch, uid, formData)=>{

        
    dispatch(updateChosenList(formData))

    
    const userDocRef = doc(db, 'users', uid); // Replace 'USER_ID' with the actual user's document ID

    try {

     const tableData ={
        ...formData,
        createdAt: getDate(),
        lastModified: getDate(),
      }

      const tableDocRef = doc(collection(userDocRef, 'lists'), formData.listName);
      await setDoc(tableDocRef, tableData);
      dispatch(revertAllFieldsIDs())
      dispatch(getUserListsThunk(uid))

      console.log('List document written with ID:', tableDocRef.id);
      toast.success(`list ${formData.listName} modified`)
      dispatch(toggleIsSubmitting())
    } catch (error) {
      console.error('Error adding documents:', error);
      toast.error(error.message)
      dispatch(toggleIsSubmitting())
    }

  }



export const addWorkerThunk = (e, chosenList, uid)=>{
    return async(dispatch)=>{

      dispatch(toggleIsSubmitting())

        const formData = new FormData(e.target);
        let formDataObject = { workers: [] };
      
        formData.forEach((value, key) => {
          const [field, dataIndex] = key.split('-'); // Split the name attribute to get field and dataIndex
          if (field === "listworker") {
            if (!formDataObject.workers[dataIndex]) {
              formDataObject.workers[dataIndex] = {}; // Initialize worker object if it doesn't exist
            }
            // Add worker properties directly to the worker object
            formDataObject.workers[dataIndex].listworker = value;
            formDataObject.workers[dataIndex].createdAt = getDate();
            formDataObject.workers[dataIndex].lastModified = getDate();
            formDataObject.workers[dataIndex].ID = nanoid(6); // Generate random ID
            formDataObject.workers[dataIndex].foodOrdered = [];
          }
        });
      
        formDataObject.workers = Object.values(formDataObject.workers);
      
        let newChosenListObj = {...chosenList};
        newChosenListObj.workers = [...newChosenListObj.workers, ...formDataObject.workers]

        console.log(newChosenListObj)

     

        modifyList(dispatch, uid, newChosenListObj)

    }
}