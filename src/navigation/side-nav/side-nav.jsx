import { useDispatch, useSelector } from "react-redux"
import "./side-nav.css"
import { toggleOpenAutoTable, toggleOpenListModifier, toggleOpenLists, toggleopenGenericTable } from "../../store/modals-slices/all-modals-controller"
import { AddTable, Burger, CreateList, EditList, NavigateBackArrow, PlusIcon, Selected, Settings } from "../../assets/icons"
import { useState } from "react"
import { useFilterContext } from "../../utilites/filter-context"
export default function SideNav({toggleNav, showNav}){

    const dispatch = useDispatch()
    const openAutoTable = useSelector((state)=>state.allModalsController.openAutoTable)
    const openListModifier = useSelector((state)=>state.allModalsController.openListModifier)
    const openLists = useSelector((state)=>state.allModalsController.openLists)
    const openGenericTable = useSelector((state)=>state.allModalsController.openGenericTable)

    const userData = useSelector((state)=> state.auth.userData)
    const {displayName} = userData
    const firstName = displayName.split(' ')[0]
    const [drawerOpen, setDrawerOpen] = useState(false)

    const {tableCluster, setTableCluster} = useFilterContext()



    return(
        <>
        <div className={`side-nav ${showNav ? 'open' : 'min'}`}>
            <div>
                <div className={`burger-and-title ${showNav ? 'open' : 'min'}`}>
                    <div className="burger" onClick={toggleNav}>
                        <Burger/>
                    </div>
                    <p className={showNav ? 'open' : 'min'}>Orders Tracker</p>
                </div>

                <div className="solo-top-button" title="add table">
                <button onClick={()=>{dispatch(toggleOpenAutoTable())}} className={`${openAutoTable ? 'active': ''} ${showNav ? 'open' : 'min'}`}> <PlusIcon/>  <p >Add Table</p></button>
                </div>
                <div className="button-group">
                    <button title="create list" onClick={()=>{dispatch(toggleOpenLists())}} className={`${openLists ? 'active': ''} ${showNav ? 'open' : 'min'}`}><CreateList/> <p >Create list</p></button>
                    <button title="edit list " onClick={()=>{dispatch(toggleOpenListModifier())}} className={`${openListModifier ? 'active': ''} ${showNav ? 'open' : 'min'}`}><EditList/> <p>Modify list</p></button>
                    <button title="add generic table" onClick={()=>{dispatch(toggleopenGenericTable())}} className={`${openGenericTable ? 'active': ''} ${showNav ? 'open' : 'min'}`}><AddTable/> <p>Generic table</p></button>
                </div>
            </div>

            <div className="settings-container">
                {/* add the drawer to configure arrangement of tables */}
                <div className={`drawer ${drawerOpen ? 'active': ''}`}>
                    <div className="guide-icon" onClick={()=>setDrawerOpen((prevState)=>!prevState)}><Settings/> <p>Configuration</p> <NavigateBackArrow/></div>
                    <div className={`drawer-lower`}>
                        <button className={`first ${drawerOpen ? 'animate': ''} ${tableCluster === 0 ? 'active' : ''}`} onClick={()=>{setTableCluster(0)}}><p >{tableCluster === 0 && <Selected/>}</p>day</button>
                        <button className={`second ${drawerOpen ? 'animate': ''} ${tableCluster === 1 ? 'active' : ''}`} onClick={()=>{setTableCluster(1)}}><p>{tableCluster === 1 && <Selected/>}</p>month</button>
                        <button className={`third ${drawerOpen ? 'animate': ''} ${tableCluster === 2 ? 'active' : ''}`} onClick={()=>{setTableCluster(2)}}><p>{tableCluster === 2 && <Selected/>}</p>year</button>
                    </div>
                </div>
                <button className={`toggle-config ${drawerOpen ? 'active': ''}  ${showNav ? 'open' : 'min'}`} onClick={()=>setDrawerOpen((prevState)=>!prevState)}> <div className="display-picture"></div><p className={showNav ? 'open' : 'min'}>Hi,  {firstName}</p></button>
            </div>

        </div>
        <div className={`auto-bg-side ${showNav ? 'open' : '' }`} onClick={toggleNav}></div>
        </>
    )
}