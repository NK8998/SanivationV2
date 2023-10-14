import { createContext, useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkerData, initialFetchTable } from "../store/worker-slice";
import { initialWorkers } from "../store/table-slice";
import { fetchInitialData } from "../store/home-slice";

const FilteringContext = createContext();


const FilteredContentProvider = ({children})=>{
    //allows us to filter for specific page
    const pageRenderedRef = useRef()
    const [bottomReached, setBottomReached] = useState()
  
    const [individualTable, setIndividualTable] = useState(false)


    
    const [sortBy, setSortBy] = useState('created')
    const [sortOrder, setSortOrder] = useState('descending')

    const [editingWorker, setEditingWorker] = useState(false)

    const [filter, setFilter] = useState('')

    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const dispatch = useDispatch()

    const [tableName, setTableName] = useState()
    const [workerID, setWorkerID] = useState()


    const [tableCluster, setTableCluster] = useState(2)
   

    




    const converTime = (time)=>{

        const date = new Date(time);

        const timestampSeconds = Math.floor(date.getTime() / 1000);

        return(timestampSeconds)

    }


    const filterRouteData = (array, years)=>{

     
        if(years){
          let newYearsArray = array

          const comparator = (a, b)=>{
            let valueA, valueB;
            valueA = a.year
            valueB = b.year


            const compareResult = sortOrder === 'ascending' ? 1 : -1;

            if (valueA < valueB) {
              return -compareResult;
            }
            if (valueA > valueB) {
              return compareResult;
            }
            return 0;
        
        
          
          }

          
        
          const sortedYearsArray = newYearsArray.slice().sort(comparator);
          return sortedYearsArray
            
        }
     
        if (individualTable) {
            let newWorkersArray = array;

            const comparator = (a, b) => {
              let valueA, valueB;
          
              switch (sortBy) {
                case 'name':
                  valueA = (a.worker || a.listworker ||'').toLowerCase();
                  valueB = (b.worker || b.listworker || '').toLowerCase();
                  break;
          
                case 'created':
                  valueA = converTime(a.createdAt);
                  valueB = converTime(b.createdAt);
                  break;
          
                case 'modified':
                  valueA = converTime(a.lastModified);
                  valueB = converTime(b.lastModified);
                  break;

               
                
          
                default:
                  return 0; // Handle the default case if needed
              }
          
              const compareResult = sortOrder === 'ascending' ? 1 : -1;
          
              if (valueA < valueB) {
                return -compareResult;
              }
              if (valueA > valueB) {
                return compareResult;
              }
              return 0;
            };
          
            const sortedWorkers = newWorkersArray.slice().sort(comparator);
            return sortedWorkers
          }else{
                let newTablesArray = array;

                
                  const comparator = (a, b) => {
                    let valueA, valueB;
                
                    switch (sortBy) {
                      case 'name':
                        valueA = a.tableName.toLowerCase();
                        valueB = b.tableName.toLowerCase();
                        break;
                
                      case 'created':
                        valueA = converTime(a.createdAt);
                        valueB = converTime(b.createdAt);
                        break;
                
                      case 'modified':
                        valueA = converTime(a.lastModified);
                        valueB = converTime(b.lastModified);
                        break;

                      default:
                        return 0; // Handle the default case if needed
                    }
                
                    const compareResult = sortOrder === 'ascending' ? 1 : -1;
                
                    if (valueA < valueB) {
                      return -compareResult;
                    }
                    if (valueA > valueB) {
                      return compareResult;
                    }
                    return 0;
                  };
                
                  const sortedTables = newTablesArray.slice().sort(comparator);
                  return sortedTables
            }

    
    }



    const fetchFilteredData = ()=>{
      if(editingWorker) return
      // fetch data
      if(individualTable){
        dispatch(initialWorkers(filter, uid, tableName))
      }else{
        dispatch(fetchInitialData(filter, uid))
      }
    }






    return(
        <FilteringContext.Provider value={{
            filterRouteData,

            individualTable, setIndividualTable, 

            editingWorker, setEditingWorker,

            sortBy, setSortBy,

            sortOrder, setSortOrder,
            
            pageRenderedRef,
            bottomReached, setBottomReached,

            filter, setFilter,

            fetchFilteredData,

            tableName, setTableName,

            tableCluster, setTableCluster,

            workerID, setWorkerID

            }}>
            {children}
        </FilteringContext.Provider>
    );


};


const useFilterContext = () => {
    const context = useContext(FilteringContext);
    if (!context) {
      throw new Error('useFilterContext must be used within a FilteredContentProvider');
    }
    return context;
  };

  export { FilteredContentProvider, useFilterContext };
