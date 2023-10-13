import {createSlice} from "@reduxjs/toolkit";
import { db } from "../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, where, query } from "firebase/firestore"




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
  return async (dispatch) => {
    dispatch(revertLoading(true));
    const userDocRef = doc(db, 'users', uid);
    const allTablesRef = collection(userDocRef, 'tables');

    // Create a query that includes the filter criteria for document IDs
    let q = allTablesRef;

  
    if (filter) {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const tableData = querySnapshot.docs.map((doc) => doc.data());

        const filteredTables =  tableData.filter((table)=>
        table.tableName.toLowerCase().includes(filter.toLowerCase()))
        
        dispatch(initialFetch(filteredTables));
      } else {
        dispatch(initialFetch([]))
        console.log('No matching documents found.');
      }
      dispatch(revertLoading(false));

    } else {
      // Fetch all documents if no filter is provided
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const tableData = querySnapshot.docs.map((doc) => doc.data());
        dispatch(initialFetch(tableData));
      } else {
        console.log('No matching documents found.');
      }
      dispatch(revertLoading(false));
    }
  };
};



  // Thunk action for dynamic data fetch
export const fetchDynamicData = () => {
    return async (dispatch) => {
      try {
        // Fetch dynamic data asynchronously
        // const dynamicData = await fetchDynamicDataFromApi();
        // const moreData = ['table-3', 'table-04']
        // Dispatch the dynamicFetch action with fetched data
        dispatch(dynamicFetch(moreData));
      } catch (error) {
        // Handle errors if necessary
      }
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
         
        } catch (error) {
            console.error('Error updating table document:', error);
        }



    }
  }
  