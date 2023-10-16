import {createSlice} from "@reduxjs/toolkit";
import { db } from "../../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid";
import { getDate } from "../../utilites/get-date";
import { fetchInitialData, initialFetch } from "../home-slice";
import { useRef } from "react";
import toast from "react-hot-toast";



const autoTableSlice = createSlice({
    name: 'autoTable',
    initialState:{
        lists: [],
        totalizer: {},
        chosenList:{workers: []},
        foodPickerOpen: false,
        currentWorker: {},
        loading: true,
        errorState: false,
        errMessage: '',
        successState: false,
        successMessage: '',
    },
    reducers:{
        fetchLists:(state, action)=>{
            state.lists = action.payload
            state.loading = false
        },
        updateTotalizer:(state, action)=>{
            state.totalizer = action.payload
        },
        updateChosenList:(state, action)=>{
            state.chosenList = action.payload
        },
        toggleFoodPicker_:(state, action)=>{
            state.foodPickerOpen = !state.foodPickerOpen
           
        },
        updateCurrentWorker:(state, action)=>{
            state.currentWorker = action.payload
        },
        revertLoading:(state, action)=>{
            state.loading = true
        },
        showError:(state, action)=>{
            state.errorState = !state.errorState
            state.errMessage = action.payload
        },
        showSuccess:(state, action)=>{
           state.successState = !state.successState
        }
    }
})


export const {fetchLists, updateTotalizer, updateChosenList, toggleFoodPicker_, updateCurrentWorker, revertLoading, showError, showSuccess} = autoTableSlice.actions

export default autoTableSlice.reducer


export const getUserListThunk = (uid) => {
    return (dispatch) => {
      const userDocRef = doc(db, 'users', uid);
      const allListsRef = collection(userDocRef, 'lists');
  
      getDocs(allListsRef)
        .then((allLists) => {
          if (allLists) {
            const lists = allLists.docs.map((doc) => doc.data());
            // Dispatch a success action
            dispatch(fetchLists(lists));
          } else {
            console.log('Table document does not exist.');
          }
        })
        .catch((error) => {
          // Handle Firebase error
          console.error('Error fetching table document:', error);
          toast.error(error.message)
        });
    };
  };

  const uploadTable = (dispatch, uid, totalizer, newTableObj) => {
    const tableData = {
      ...newTableObj,
      totalizer: { ...totalizer },
    };
  
    const userDocRef = doc(db, 'users', uid);
  
    const tableDocRef = doc(collection(userDocRef, 'tables'), newTableObj.tableName);
  
    setDoc(tableDocRef, tableData)
      .then(() => {
        console.log('Table document written with ID:', tableDocRef.id);
        dispatch(fetchInitialData('', uid));
        toast.success('Successfully added table')
      })
      .catch((error) => {
        console.error('Error adding documents:', error);
        toast.error(error.message)
      });
  };

export const generateTableThunk = (uid, totalizer, chosenList)=>{

    return async(dispatch)=>{

        const uniqueID = nanoid(6)
        
        const tableName = `Table-${getDate()}_${uniqueID}`;

        let tableObj = {...chosenList};
        tableObj.createdAt = getDate()
        tableObj.lastModified = getDate()
        
        
        const newTableObj = {...tableObj, tableName: tableName, tableID: uniqueID}

        const newWorkersArray = newTableObj.workers.map((worker)=>{
            return {...worker, createdAt:getDate(), lastModified:getDate()}
        })

        newTableObj.workers = newWorkersArray
    

        uploadTable(dispatch, uid, totalizer, newTableObj)

    }


}