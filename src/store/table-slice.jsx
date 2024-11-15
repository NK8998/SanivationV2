import {createSlice} from "@reduxjs/toolkit";
import { db } from "../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { getDate } from "../utilites/get-date";
import toast from "react-hot-toast";


const tableSlice =createSlice({
    name: 'table',
    initialState: {
        tableData: {workers:[]},
        loading: true,
        error: '',
        success: ''
    },
    reducers:{
        fetchWorkers: (state, action)=>{
            state.tableData = action.payload
            state.loading = false
        },
        revertLoading:(state, action)=>{
            state.loading = action.payload
        }
    }

})


export const {fetchWorkers, revertLoading} = tableSlice.actions

export default tableSlice.reducer;


export const initialWorkers = (filter, uid, tableName)=>{

    return async (dispatch)=>{

        dispatch(revertLoading(true))

        const userDocRef = doc(db, 'users', uid);
        const tableDocRef = doc(userDocRef, 'tables', tableName);

        if(filter){

          try{
            
          const tableDocSnapshot = await getDoc(tableDocRef);               
        
          if (tableDocSnapshot.exists()) {
            const individualTableData = tableDocSnapshot.data();
      
            const workers = individualTableData.workers 

            const filteredWorkers = workers.filter((worker)=>
            (worker.listworker || worker.worker).toLowerCase().includes(filter.toLowerCase())) 

            individualTableData.workers = filteredWorkers

            dispatch(fetchWorkers(individualTableData))

        }

          }catch(error){
              console.error('error fetching', error)
              toast.error(error.message)
          }finally{
            dispatch(revertLoading(false))
          }


      }else {

        try {
          const tableDocSnapshot = await getDoc(tableDocRef);               
      
          if (tableDocSnapshot.exists()) {
            const individualTableData = tableDocSnapshot.data();

            dispatch(fetchWorkers(individualTableData))
            
          } else {
            console.log('Table document does not exist.');

          }
       
        } catch (error) {
          console.error('Error fetching table document:', error);
          toast.error(error.message)
          // remeber to show wthe error
        }finally{
          dispatch(revertLoading(false))
        }

      }
       

    }
}


export const removeWorkerFromArray = (uid, tableName, workerID)=>{

    return async (dispatch) =>{
        try {
            const userDocRef = doc(db, 'users', uid);
            const tableDocRef = doc(userDocRef, 'tables', tableName);
        
            // Fetch the existing table data
            const tableDocSnapshot = await getDoc(tableDocRef);
        
            if (tableDocSnapshot.exists()) {
              const tableData = tableDocSnapshot.data();
              const workerToBeRemoved = tableData.workers.find((worker)=> worker.ID  === workerID)

              const newWorkersArray = tableData.workers.filter((workerObj) => workerObj.ID !== workerID)
              // Update the workers array in the table data
              tableData.workers = newWorkersArray;
              tableData.totalizer.totalPackets -= workerToBeRemoved.totalPackets
              tableData.totalizer.totalPlates = newWorkersArray.length
              // Update the lastModified timestamp
              tableData.lastModified = getDate();
              
              dispatch(fetchWorkers(tableData))
            
        
              // Save the updated table data back to Firestore
              await setDoc(tableDocRef, tableData);
              console.log('Table document updated:', tableDocRef.id);
   
              toast.success(`worker with ID ${workerID}`)
            } else {
            console.log('Table document does not exist.');
            } 

        }catch (error) {
          toast.error(error.message)
          console.error('Error updating table document:', error);
        }
    }

}