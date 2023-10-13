import { Route, Routes } from "react-router-dom";
import Home from "../../pages/home/home";
import Table from "../../pages/tables/table";
import Worker from "../../pages/worker/worker";
import { useEffect, useRef } from "react";
import { useFilterContext } from "../../utilites/filter-context";


export default function AllRoutes(){

    const {pageRenderedRef, setBottomReached} = useFilterContext()
   
    const handleScroll = ()=>{
        if (pageRenderedRef.current.scrollTop + pageRenderedRef.current.clientHeight >= pageRenderedRef.current.scrollHeight) {
            setBottomReached(Date.now())
          }
        
    }
   
    return(
        <div className="route-renderer" ref={pageRenderedRef} onScroll={handleScroll}>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/:tableName" element={<Table />}/>
            <Route path="/:tableName/:workerID" element={<Worker/>}/>
        </Routes>
        </div>
    )
}