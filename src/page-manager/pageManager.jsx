import { useSelector } from 'react-redux';
import Header from '../navigation/header/header';
import SideNav from '../navigation/side-nav/side-nav';
import PageManagerUpper from './page-manager-upper/page-manager-upper';
import AllRoutes from './all-routes/allRoutes';
import ModalsExport from './modals-export/modals-exports';
import { Burger, CloseEx, PrinterIcon, ShowData } from '../assets/icons';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFilterContext } from '../utilites/filter-context';
import TableTotalizer from './table-totalizer';
import { getSummary } from './get-summary';


export default function PageManager(){

  const {filterRouteData, individualTable} = useFilterContext()

  useEffect(()=>{

    toast( 
    (t) => (

      <span>
        <p>Before proceeding, ensure the date on your device is correct. <b>If it is ignore this.</b></p>
      
        <button className='toast-button-center' onClick={() => toast.dismiss(t.id)}>
          Dismiss
        </button>
      
      </span>
    ), {
      duration: 8000,
      position: "top-center",
      style: {
        border: '1px solid #fcb1b1',
        // padding: '16px',
        color: '#585858',
        fontSize: '15px',
      }
    });
   

  }, [])
 


    const [showNav, setShowNav] = useState(true)

    const userData = useSelector((state)=>state.auth.userData)
    const [showTableData, setShowTableData] = useState(false)
    const {uid } = userData
    const [allMonths, setAllMonths] = useState(false)
    const [summaryModal, setSummaryModal] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const toggleNav = ()=>{
        setShowNav((prevState) =>!prevState)
    }




  
    return(
        <>
        <Toaster position="top-right"/>

        <div className='page-manager'>
        <SideNav showNav={showNav} toggleNav={toggleNav} />
            <div className='header-and-pages'>
                <div className='header-burger' onClick={toggleNav}>
                    <Burger/>
                </div>
                <div className='orders-and-summary'>
                  <h1>Orders</h1>
                  <div className='right-bundle'>
                  <button onClick={()=>setSummaryModal(true)} title='get summary'><PrinterIcon/></button>
                  {individualTable && <button className='show-data' onClick={()=>setShowTableData((prevState)=>!prevState)}><ShowData/>show data</button>}
                  </div>
                </div>
                <div className='page-rendered'>
                    <PageManagerUpper/>
                        <Header/>
                        <AllRoutes/>
                 
                </div>
            </div>
            <div className={`company-picture ${individualTable ? 'active' : ''} ${showTableData ? 'show': ''}`}>
              {individualTable && <TableTotalizer setShowTableData={setShowTableData} showTableData={showTableData}/>}
            </div>
        </div>
       {summaryModal &&  
        <>
          <div className='summary-bg-black' onClick={()=>setSummaryModal((prevState)=>!prevState)}></div>
          <div className='summary-modal'>
            <p>Select whether to get summary of all months or just the current month</p>
            <div className='summary-buttons'>
              <button className={`${allMonths ? 'chosen': ''}`} onClick={()=>setAllMonths(true)}>All months</button>
              <button className={`${allMonths ? '': 'chosen'}`} onClick={()=>setAllMonths(false)}>Current month</button>
            </div>
            <div className='modal-bottom pdf'>
              <button  onClick={()=>setSummaryModal((prevState)=>!prevState)}>Cancel</button>

              {isGenerating ?
                <button className='right-button loading'><div className='loader'></div></button>
                  :
                <button onClick={()=>getSummary(setIsGenerating, filterRouteData, allMonths, uid)}><PrinterIcon/>Get Pdf</button>
              }            
          </div>
          </div>
          </>}
        <ModalsExport />
        </>
    )
}