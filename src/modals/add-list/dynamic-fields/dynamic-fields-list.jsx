// import { RemoveMinusIcon } from "../../../assets/page-rendered-assets";

import { useState } from "react";
import { AddPlusIcon, MenuDropDown, RemoveMinusIcon } from "../../../assets/icons";

export default function DynamicFieldsList({removeFields, dataindex}){

    const [dropDownOpen, setDropdownOpen] = useState(false)
    const [type, setType] = useState('')
    const [typeOptions, setTypeOptions] = useState(['SGA', 'COGS', 'Casual', 'HQ'])

    const typeEl = typeOptions.map((option)=>{
        return (
            <div className="type-options" key={option} onClick={()=>setType(option)}>{option}</div>
        )
    })

    const toggleDropdown = ()=>{
        setDropdownOpen((prevState)=> !prevState)

        document.addEventListener('click', (e)=>{

            if(!e.target.closest(`.drop-down-types-${dataindex}`) && !e.target.closest(`.input-type-box-${dataindex}`)){

                setDropdownOpen(false)

            }
        })
    }

    return(
        <div className="worker-dynamic-wrapper">
            <div className="worker-dynamic">
                <input type="text" name={`listworker-${dataindex}`} placeholder="add person's name"/>
                <div className={`input-type-box-${dataindex} input-type-box ${dropDownOpen ? 'dropdown-open' : ''}`} onClick={toggleDropdown}>
                    <p>Type:</p>
                    <input type="text" className={`types-input-${dataindex} types-input`} name={`type-${dataindex}`}   value={type} readOnly />
                    <MenuDropDown />
                </div>
                <div onClick={removeFields} dataindex={dataindex} className="addplus"><RemoveMinusIcon/></div>
                {dropDownOpen &&
                    <div className={`drop-down-types-${dataindex} drop-down-types`}>
                    {typeEl}
                </div>}
            </div>
        </div>
    )
}