import { useState } from "react"
import { AccountCircle, MenuDropDown, TrashIcon } from "../../assets/icons"

export default function ListContent({worker, updateWorkerType, toggleRemovingWorker}){
    const [type, setType] = useState(worker.type)
    const [typeOptions, setTypeOptions] = useState(['SGA', 'COGS', 'Casual', 'HQ'])
    const [dropDownOpen, setDropdownOpen] = useState(false)

    const updatedType = (option)=>{
        setType(option)
        updateWorkerType(worker, option)
    }

    const typeEl = typeOptions.map((option)=>{
      return (
          <div className="type-options" key={option} onClick={()=>updatedType(option)}>{option}</div>
      )
    })

    const toggleDropdown = ()=>{
      setDropdownOpen((prevState)=> !prevState)

      document.addEventListener('click', (e)=>{

          if(!e.target.closest(`.drop-down-types-${worker.ID}`) && !e.target.closest(`.input-type-box-${worker.ID}`)){

              setDropdownOpen(false)

          }
      })
    }
  
      return(
          <div className="worker-container" key={worker.ID}>
  
              <p className="account-default"><AccountCircle/></p>
              <p className="list-worker">{worker.listworker}</p>
          
            <div className="worker-dynamic-wrapper modifying">
              <div className={`input-type-box-${worker.ID}  input-type-box ${dropDownOpen ? 'dropdown-open' : ''}`} onClick={toggleDropdown}>
                    <p>Type:</p>
                    <input type="text" className={`types-input`} name={`type type-${worker.ID}`}   value={type} readOnly />
                    <MenuDropDown />
              </div>  

              {dropDownOpen &&
                  <div className={`drop-down-types-${worker.ID} drop-down-types`}>
                  {typeEl}
              </div>}   
            </div>
            <p className="trash-remove" onClick={()=>{toggleRemovingWorker(worker)}}><TrashIcon/></p>
          </div>
      )
}