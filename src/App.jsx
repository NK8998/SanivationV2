import './App.css'
import { useSelector } from 'react-redux';
import { SignIn } from './authentication/sign-in';
import PageManager from './page-manager/pageManager';
import { FilteredContentProvider } from './utilites/filter-context';
import { useEffect } from 'react';

function App() {

  const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn)

  
  
  
  return (
 
    isLoggedIn ? 

    <FilteredContentProvider>
      <PageManager/> 
    </FilteredContentProvider>
    
    : 
    <SignIn/> 
  
  )
}

export default App
