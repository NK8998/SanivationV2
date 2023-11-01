import {createSlice} from "@reduxjs/toolkit";
import { db } from "../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, where, query, limit, startAt, endAt, orderBy } from "firebase/firestore"
import toast from "react-hot-toast";




const homeSlice = createSlice({
    name: 'home',
    initialState:{
        alltables: [],
        filter: '',
        loading: true,
        moreloading: true,
        error: ''
    },
    reducers:{
    initialFetch: (state, action)=>{
        // fetch first 80 tables
        state.alltables = action.payload
        state.loading = false
    },
    dynamicFetch:(state, action)=>{
        // fetch the next 80 tables
        state.alltables = [...state.alltables, ...action.payload]
        state.loading = false
    },
    addFilter:(state, action)=>{
        state.filter = action.payload
    },
    revertLoading:(state, action)=>{
        state.loading = action.payload
    }

    }


})

export const {initialFetch, dynamicFetch, addFilter, revertLoading} = homeSlice.actions

  
export default homeSlice.reducer;


// Thunk action for initial data fetch
export const fetchInitialData = (filter, uid) => {
  return (dispatch) => {
    dispatch(revertLoading(true));
    const userDocRef = doc(db, 'users', uid);
    const allTablesRef = collection(userDocRef, 'tables');

    // Create a query that includes the filter criteria for document IDs
    let q = query(allTablesRef, limit(100));

    if(filter){
      q = query(allTablesRef);
    }

    getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let tableData = querySnapshot.docs.map((doc) => doc.data());

          if(filter){
            tableData = tableData.filter((table)=> table.tableName.toLowerCase().includes(filter.toLowerCase()))
          }

          dispatch(initialFetch(tableData));
        } else {
          dispatch(initialFetch([]));
          console.log('No matching documents found.');
        }
        dispatch(revertLoading(false));
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
        dispatch(revertLoading(false));
        toast.error(error.message);
      });
  };
};





  // Thunk action for dynamic data fetch
export const fetchDynamicData = (filter, uid, fetchedTableIds, loading) => {
    return async (dispatch) => {
      
        if(loading) return
        const userDocRef = doc(db, 'users', uid);
        const allTablesRef = collection(userDocRef, 'tables');

        // Create a query that includes the filter criteria for document IDs
        let q = query(allTablesRef, where('tableID', 'not-in', fetchedTableIds), limit(50));

        if(filter){
          q = query(allTablesRef, where('tableID', 'not-in', fetchedTableIds));
        }
        getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            let tableData = querySnapshot.docs.map((doc) => doc.data());
  
            if(filter){
              tableData = tableData.filter((table)=> table.tableName.toLowerCase().includes(filter.toLowerCase()))
            }
  

            dispatch(dynamicFetch(tableData));   
          } else {
            // dispatch(initialFetch([]));
            console.log('No matching documents found.');
          }
        
        })
        .catch((error) => {
          console.error('Error fetching documents:', error);
          
          toast.error(error.message);
        });

      
    };
  };

  export const removeTableFromArray = (allTables, uid, tableName) =>{
    return async (dispatch)=>{

        
  
        try {
            const userDocRef = doc(db, 'users', uid);
            const tableDocRef = doc(userDocRef, 'tables', tableName);
        
            await deleteDoc(tableDocRef);
            console.log('Table document deleted:', tableDocRef.id);

        //   filter allTables array first
            const newTablesArray = allTables.filter((table)=> table.tableName !== tableName)

            dispatch(initialFetch(newTablesArray))
            toast.success(`${tableName} removed`)
         
        } catch (error) {
            console.error('Error updating table document:', error);
            toast.error(error.message)
        }



    }
  }
  