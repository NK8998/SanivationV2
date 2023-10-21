import { useDispatch, useSelector } from "react-redux"
import { AddTable, CreateList, EditList, PlusIcon } from "../../assets/icons"
import { toggleOpenAutoTable, toggleOpenListModifier, toggleOpenLists, toggleopenGenericTable } from "../../store/modals-slices/all-modals-controller"
import { useSearchParams } from "react-router-dom"

export default function Chin({}){

    const [searchParams, setSearchParams] = useSearchParams()

    const updateModal = (modalValue) => {
      // Create a new search parameters object and set the 'modal' parameter to the new value
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('modal', modalValue);
    
      // Replace the entire search parameters with the updated one
      setSearchParams(newSearchParams, {replace: true});
    };

    const modal = searchParams.get('modal')

   
    
    return (
      <div className="chin">
        <button onClick={() => updateModal('auto-table')} className={modal === 'auto-table' ? 'chin-button-active' : ''}>
          <PlusIcon />
        </button>
        <button onClick={() => updateModal('add-list')} className={modal === 'add-list' ? 'chin-button-active' : ''}>
          <CreateList />
        </button>
        <button onClick={() => updateModal('modify-list')} className={modal === 'modify-list' ? 'chin-button-active' : ''}>
          <EditList />
        </button>
        <button onClick={() => updateModal('generic')} className={`${modal === 'generic' ? 'chin-button-active' : ''} generic-btn`}>
          <AddTable />
        </button>
      </div>
    );
}    