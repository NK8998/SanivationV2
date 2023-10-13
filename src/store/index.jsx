import authSlice from "./auth-slice";
import homeSlice from "./home-slice";

import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk'; // Import Redux Thunk middleware
import tableSlice from "./table-slice";
import workerSlice from "./worker-slice";
import allModalsController from "./modals-slices/all-modals-controller";
import autoTableSlice from "./modals-slices/auto-table-slice";
import modifyListSlice from "./modals-slices/modify-list-slice";

const store = configureStore({
    reducer:{
        auth: authSlice,
        home: homeSlice,
        table: tableSlice,
        worker: workerSlice,
        allModalsController: allModalsController,
        autoTable: autoTableSlice,
        modifyList: modifyListSlice,
   

    },
    middleware: [thunk],
})


export default store;
