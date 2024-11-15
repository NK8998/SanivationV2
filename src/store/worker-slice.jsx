import {createSlice} from "@reduxjs/toolkit";
import { db } from "../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { getDate } from "../utilites/get-date";
import toast from "react-hot-toast";


const workerSlice = createSlice({
    name: 'worker',
    initialState: {
        tableData:{},
        workerData: {foodOrdered:[]},
        loading: true,
        updateWorker: Date.now(),
        isSubmitting: false
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
      },
      toggleIsSubmitting:(state, action)=>{
        state.isSubmitting = !state.isSubmitting
      }
      
    }
 

})

export const {initialFetchTable, updateWorkerData, initialFetchWorker, revertLoading, toggleIsSubmitting} = workerSlice.actions


  
export default workerSlice.reducer;


export const fetchWorkerData = (workerID, uid, tableName) => {
  return async (dispatch) => {
    const userDocRef = doc(db, 'users', uid);
    const tableDocRef = doc(userDocRef, 'tables', tableName);

    getDoc(tableDocRef)
      .then((tableDocSnapshot) => {
        if (tableDocSnapshot.exists()) {
          const tableData = tableDocSnapshot.data();
          console.log('Table data:', tableData);

          dispatch(initialFetchTable(tableData));

          // Access the workers array in the table data
          const workers = tableData.workers || [];

          // Now you can work with the workers array
          const currentWorker = workers.find((workerObj) => workerObj.ID === workerID);

          if (currentWorker) {
            // Worker with the specified name found, set the worker data
            dispatch(initialFetchWorker(currentWorker));
          } else {
            // Worker not found, you can handle this case as needed
            console.log(`Worker with ID "${workerID}" not found.`);
          }
          console.log('Workers:', workers);
        } else {
          console.log('Table document does not exist.');
        }
      })
      .catch((error) => {
        console.error('Error fetching table document:', error);
        toast.error(error.message)
      });
  };
};



const updateTable = (dispatch, uid, formData) => {
  const userDocRef = doc(db, 'users', uid);

  const tableData = {
    ...formData,
    lastModified: getDate(),
  };

  const tableDocRef = doc(collection(userDocRef, 'tables'), formData.tableName);

  setDoc(tableDocRef, tableData)
    .then(() => {
      console.log('Table document written with ID:', tableDocRef.id);
      dispatch(updateWorkerData(Date.now()));
      toast.success(`${formData.tableName} updated`)
      dispatch(toggleIsSubmitting())
    })
    .catch((error) => {
      console.error('Error adding documents:', error);
      toast.error(error.message)
      dispatch(toggleIsSubmitting())
    });
};



export const handleSubmitNameThunk = (e, uid, workerID, tableData)=>{
    return async (dispatch)=>{
    dispatch(toggleIsSubmitting())
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

export const handleSubmitOrdersThunk = (newWorkerObj, tableData, uid, workerID)=>{
    return async(dispatch)=>{
      dispatch(toggleIsSubmitting())
    let newTableData = {...tableData}
      // Create a new array with the updated worker data
    const updatedWorkers = newTableData.workers.map((workerObj) => {
    if (workerObj.ID === workerID) {
        // Update the specific foodOrdered field
        return {...newWorkerObj};
    }
    // If the worker doesn't match, return the original workerObj
    return workerObj;
    });
    
    const newTotalizer = {...newTableData.totalizer}
  
   
    newTableData.workers = updatedWorkers
   

    let newTotalPackets = 0
    newTableData.workers.forEach((worker)=>{
      newTotalPackets += worker.totalPackets
    })

    const newArrray = []
   
    newTableData.workers.map((worker)=>{
      let workerFoodArray = [...worker.foodOrdered]
    
      const filteredArrray =   workerFoodArray.filter(food=> !food.includes(' milk '))

        for(let i = 0; i < worker.totalPackets; i++){
          filteredArrray.push('milk')
        }
        
        newArrray.push(...filteredArrray)
    })
    
   const filteredNewArray =  newArrray.map((food)=> {return food.trim()})
    const foodObj = filteredNewArray.reduce((result, food) => {
        if (food!== '') { // Check if food is not an empty string
          if (!result[food]) {
            result[food] = 1; // Initialize count to 1 for the first occurrence
          } else {
            result[food]++; // Increment count for subsequent occurrences
          }
        }
        return result;
      }, {});

      let foodCountArray = []
      
      // Convert the result object to an array of objects
      foodCountArray = Object.keys(foodObj).map((foodName) => ({
        food: foodName,
        count: foodObj[foodName],
      }));
 

    const updatedTotalizer = {...newTotalizer, totalPackets:newTotalPackets, foodCountArray:foodCountArray}
      // Create a new tableData object with the updated workers array
    newTableData.totalizer = updatedTotalizer
    console.log(newTableData)
      
    updateTable(dispatch, uid, newTableData)
        
          // You can now use the updatedTableData as needed
    }
}