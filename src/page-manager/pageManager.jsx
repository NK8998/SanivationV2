import { useDispatch, useSelector } from 'react-redux';
import Header from '../navigation/header/header';
import SideNav from '../navigation/side-nav/side-nav';
import PageManagerUpper from './page-manager-upper/page-manager-upper';
import AllRoutes from './all-routes/allRoutes';
import ModalsExport from './modals-export/modals-exports';
import { Burger } from '../assets/icons';
import { useState } from 'react';


export default function PageManager(){

    const [showNav, setShowNav] = useState(false)

    const toggleNav = ()=>{
        setShowNav((prevState) =>!prevState)
    }

    return(
        <>
        <div className='page-manager'>
        <SideNav showNav={showNav} toggleNav={toggleNav}/>
            <div className='header-and-pages'>
                <div className='header-burger' onClick={toggleNav}>
                    <Burger/>
                </div>
                <h1>Orders</h1>
             
                <div className='page-rendered'>
                    <PageManagerUpper/>
                        <Header/>
                        <AllRoutes/>
                 
                </div>
            </div>
            <div className='company-picture'>

            </div>
        </div>
        <ModalsExport/>
        </>
    )
}