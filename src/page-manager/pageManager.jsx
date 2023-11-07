import { useDispatch, useSelector } from 'react-redux';
import Header from '../navigation/header/header';
import SideNav from '../navigation/side-nav/side-nav';
import PageManagerUpper from './page-manager-upper/page-manager-upper';
import AllRoutes from './all-routes/allRoutes';
import ModalsExport from './modals-export/modals-exports';
import { Burger, CloseEx, ExcelIcon, LogOut, PrinterIcon, ShowData } from '../assets/icons';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFilterContext } from '../utilites/filter-context';
import TableTotalizer from './table-totalizer';
import { getSummaryPdf } from './get-summary-pdf';
import { getSummaryExcel } from './get-summary-excel';
import { userLoggedOut } from '../store/auth-slice';


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
    const [allMonthsExcel, setAllMonthsExcel] = useState(false)
    const [summaryYear, setSummaryYear] = useState('')
    const [summaryModalPDF,  setSummaryModalPDF] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [summaryExcel, setSummaryExcel] = useState(false)
    const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)
    const [chosenMonth, setChosenMonth] = useState('')

    const [loggingOut, setLoggingOut] = useState(false)
    const toggleNav = ()=>{
        setShowNav((prevState) =>!prevState)
    }
    const dispatch = useDispatch()

  
    return(
        <>
        <Toaster position="top-right"/>

        <div className='page-manager'>
        <SideNav showNav={showNav} toggleNav={toggleNav} />
            <div className='header-and-pages'>
                <div className='header-burger' onClick={toggleNav}>
                    <Burger/>
                    <p>Show tools</p>
                </div>
                <div className='orders-and-summary'>
                  <h1>Orders</h1>
                  <div className='right-bundle'>
                    <div style={{display: 'flex', gap:'.5em'}}>
                      <button onClick={()=> setSummaryModalPDF(true)} title='get summary'><PrinterIcon/></button>
                      <button className='excel' onClick={()=>setSummaryExcel(true)} title="get excel summary"><ExcelIcon/>Excel</button>
                      {individualTable && <button className='show-data' onClick={()=>setShowTableData((prevState)=>!prevState)}><ShowData/>show data</button>}
                    </div>
                    <div>
                      <button className='log-out' onClick={()=>setLoggingOut(true)}>
                        <LogOut/>
                      </button>
                      {loggingOut && 
                      <>
                      <div className='summary-bg-black' onClick={()=>setLoggingOut((prevState)=>!prevState)}></div>
                      <div className='summary-modal leaving'>
                        
                          <button onClick={()=>setLoggingOut((prevState)=>!prevState)}>cancel</button>
                          <button onClick={()=>dispatch(userLoggedOut())}><LogOut/>Log out</button>
                      
                      </div>
                      </>
                      }
                    </div>
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
       {summaryModalPDF &&  
        <>
          <div className='summary-bg-black' onClick={()=> setSummaryModalPDF((prevState)=>!prevState)}></div>
          <div className='summary-modal'>
            <p>Select whether to get summary of all months or just the current month</p>
            <div className='summary-buttons'>
              <button className={`${allMonths ? 'chosen': ''}`} onClick={()=>setAllMonths(true)}>All months</button>
              <button className={`${allMonths ? '': 'chosen'}`} onClick={()=>setAllMonths(false)}>Current month</button>
            </div>
            <div className='modal-bottom pdf'>
              <button  onClick={()=> setSummaryModalPDF((prevState)=>!prevState)}>Cancel</button>

              {isGenerating ?
                <button className='right-button loading'><div className='loader'></div></button>
                  :
                <button onClick={()=>getSummaryPdf(setIsGenerating, filterRouteData, allMonths, uid)}><PrinterIcon/>Get Pdf</button>
              }            
          </div>
          </div>
          </>}

        {
          summaryExcel &&
          <>
            <div className='summary-bg-black' onClick={()=> setSummaryExcel((prevState)=>!prevState)}></div>
            <div className='summary-modal'>
              <p>Select which month to get excel sheet</p>
              <p className='custom'>Custom</p>
              <div className='upper-inputs'>
              
                <div className='flexy-input'>
                  <p>Month: </p>
                  <input type='text' name="summaryPicker" onChange={(e)=>setChosenMonth(e.target.value)} value={chosenMonth}/>
                </div>
                <div className='flexy-input'>
                  <p>Year: </p>
                  <input type='text' name="yearofSummary" onChange={(e)=>setSummaryYear(e.target.value)} value={summaryYear}/>
                </div>
              </div>

              <div className='summary-buttons'>
              {/* <button className={`${(allMonthsExcel && !chosenMonth && !summaryYear) ? 'chosen': ''}`} onClick={()=>{setAllMonthsExcel(true); setChosenMonth(''); setSummaryYear('')}}>All months</button> */}
              <button className={`${(!allMonthsExcel && !chosenMonth && !summaryYear) ? 'chosen': ''}`} onClick={()=>{setAllMonthsExcel(false); setChosenMonth(''); setSummaryYear('')}}>Current month</button>

            </div>
            <div className='modal-bottom pdf'>
              <button  onClick={()=> setSummaryExcel((prevState)=>!prevState)}>Cancel</button>

              {isGeneratingExcel ?
                <button className='right-button loading'><div className='loader'></div></button>
                  :
                <button onClick={()=>getSummaryExcel(setIsGeneratingExcel, filterRouteData, allMonthsExcel, uid, chosenMonth, summaryYear)}><ExcelIcon/>Get Excel</button>
              }            
          </div>
            </div>
          </>
        }
        <ModalsExport />
        </>
    )
}