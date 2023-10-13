import {createSlice} from "@reduxjs/toolkit";
import { db } from "../../authentication/config";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { nanoid } from "nanoid";
import { getDate } from "../../utilites/get-date";
import { fetchInitialData, initialFetch } from "../home-slice";


const autoTableSlice = createSlice({
    name: 'autoTable',
    initialState:{
        lists: [],
        totalizer: {},
        chosenList:{},
        foodPickerOpen: false,
        currentWorker: {},
        loading: true,
        error: ''
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
        }
    }
})


export const {fetchLists, updateTotalizer, updateChosenList, toggleFoodPicker_, updateCurrentWorker, revertLoading} = autoTableSlice.actions

export default autoTableSlice.reducer


export const getUserListThunk=(uid)=>{

    return async(dispatch)=>{
        const userDocRef = doc(db, 'users', uid);
        const allListsRef = collection(userDocRef, 'lists');
        try {
          const allLists =  await getDocs(allListsRef)
         
      
          if (allLists) {
            const lists = allLists.docs.map((doc) => doc.data());
            // console.log('Table data:', individualTableData);
           
            dispatch(fetchLists(lists))

          } else {
            console.log('Table document does not exist.');
          }
     
        } catch (error) {
          console.error('Error fetching table document:', error);
          setLoading(false) 
          // remeber to throw error
          dispatch
        }
    }

}

const uploadTable = async (dispatch, uid, totalizer, newTableObj)=>{

    const tableData = {
        ...newTableObj,
        totalizer: {...totalizer}
      }
      
      
      const userDocRef = doc(db, 'users', uid); // Replace 'USER_ID' with the actual user's document ID
   
      try {
        const tableDocRef = doc(collection(userDocRef, 'tables'), newTableObj.tableName);
        await setDoc(tableDocRef, tableData);

        console.log('Table document written with ID:', tableDocRef.id);
        dispatch(fetchInitialData('', uid))
      } catch (error) {
        console.error('Error adding documents:', error);
      }

}

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