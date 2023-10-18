import {createSlice} from "@reduxjs/toolkit";


const allModalsControllerSlice = createSlice({
    name: 'modalsController',
    initialState:{
        openLists: false,
        openListModifier: false,
        openAutoTable: false,
        openGenericTable: false,
    },
    reducers:{
        toggleOpenLists:(state, action)=>{
            state.openLists = !state.openLists
            state.openListModifier =false
            state.openAutoTable =false
            state.openGenericTable = false
        },
        toggleOpenListModifier:(state, action)=>{
            state.openListModifier = !state.openListModifier
            state.openLists =false
            state.openAutoTable =false
            state.openGenericTable = false
        },
        toggleOpenAutoTable:(state, action)=>{
            state.openAutoTable = !state.openAutoTable
            state.openListModifier =false
            state.openLists =false
            state.openGenericTable = false
        },
        toggleopenGenericTable:(state, action)=>{
            state.openGenericTable = !state.openGenericTable
            state.openListModifier =false
            state.openAutoTable =false
            state.openLists = false
        },
        closeAllModals:(state, action)=>{
            state.openGenericTable = false
            state.openListModifier =false
            state.openAutoTable =false
            state.openLists = false
        }

    }
})


export const {toggleOpenLists, toggleOpenListModifier, toggleOpenAutoTable, toggleopenGenericTable, closeAllModals} = allModalsControllerSlice.actions

export default allModalsControllerSlice.reducer
