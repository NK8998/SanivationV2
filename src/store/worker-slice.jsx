import {createSlice} from "@reduxjs/toolkit";
import { db } from "../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { getDate } from "../utilites/get-date";


const workerSlice = createSlice({
    name: 'worker',
    initialState: {
        tableData:{},
        workerData: {},
        loading: true,
        error: '',
        updateWorker: Date.now(),
    },
    reducers:{
      initialFetchTable:(state, action)=>{
          state.tableData = action.payload;
      },
      initialFetchWorker:(state, action)=>{
          state.workerData = action.payload
      },
      updateWorkerData:(state, action)=>{
          state.updateWorker = action.payload
      },
      revertLoading:(state, action)=>{
          state.loading = true
      }
    }
 

})

export const {initialFetchTable, updateWorkerData, initialFetchWorker, revertLoading} = workerSlice.actions


  
export default workerSlice.reducer;


export const fetchWorkerData = (workerID, uid, tableName) =>{
    return async (dispatch)=>{
        const userDocRef = doc(db, 'users', uid);
        const tableDocRef = doc(userDocRef, 'tables', tableName);
      
        try {
          const tableDocSnapshot = await getDoc(tableDocRef);
      
          if (tableDocSnapshot.exists()) {
            const tableData = tableDocSnapshot.data();
            console.log('Table data:', tableData);

          
            dispatch(initialFetchTable(tableData))
      
            // Access the workers array in the table data
            const workers = tableData.workers || [];
      
            // Now you can work with the workers array
            const currentWorker = workers.find((workerObj) => workerObj.ID === workerID);

            if (currentWorker) {
              // Worker with the specified name found, set the worker data
     
              dispatch(initialFetchWorker(currentWorker))
            } else {
              // Worker not found, you can handle this case as needed
              console.log(`Worker with name "${currentWorker}" not found.`);
            }
            console.log('Workers:', workers);
          } else {
            console.log('Table document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching table document:', error);
        }
    }
}

const updateTable = async (dispatch, uid, formData)=>{

    const userDocRef = doc(db, 'users', uid); // Replace 'USER_ID' with the actual user's document ID
        

   
    try {

     const tableData ={
        ...formData,
        lastModified: getDate(),
      }

      const tableDocRef = doc(collection(userDocRef, 'tables'), formData.tableName);
      await setDoc(tableDocRef, tableData);

      console.log('Table document written with ID:', tableDocRef.id);
  
      dispatch(updateWorkerData(Date.now()))
    } catch (error) {
      console.error('Error adding documents:', error);
    }

     
}


export const handleSubmitNameThunk = (e, uid, workerID, tableData)=>{
    return async (dispatch)=>{
    const updatedWorkers = tableData.workers.map((workerObj) => {
            if (workerObj.ID === workerID) {
              // Update the specific foodOrdered field
              return { ...workerObj, worker:e.target.editedName.value, lastModified: getDate() };
            }
            // If the worker doesn't match, return the original workerObj
            return workerObj;
          });
        
          // Create a new tableData object with the updated workers array
          const updatedTableData = {
            ...tableData,
            workers: updatedWorkers,
          };
        
          console.log(updatedTableData);
          updateTable(dispatch, uid, updatedTableData)
    }
}

export const handleSubmitOrdersThunk = (e, uid, workerID, tableData)=>{
    return async(dispatch)=>{
          // Create a new array with the updated worker data
          const updatedWorkers = tableData.workers.map((workerObj) => {
            if (workerObj.ID === workerID) {
              // Update the specific foodOrdered field
              return { ...workerObj, foodOrdered : e.target.editedOrders.value, lastModified: getDate() };
            }
            // If the worker doesn't match, return the original workerObj
            return workerObj;
          });
        
          // Create a new tableData object with the updated workers array
          const updatedTableData = {
            ...tableData,
            workers: updatedWorkers,
          };
        
          console.log(updatedTableData);
          updateTable(dispatch, uid, updatedTableData)
        
          // You can now use the updatedTableData as needed
    }
}