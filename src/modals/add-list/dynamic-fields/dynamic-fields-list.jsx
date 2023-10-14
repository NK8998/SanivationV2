// import { RemoveMinusIcon } from "../../../assets/page-rendered-assets";

import { AddPlusIcon, RemoveMinusIcon } from "../../../assets/icons";

export default function DynamicFieldsList({removeFields, dataindex}){

    return(

        <div className="worker-dynamic">
            <input type="text" name={`listworker-${dataindex}`} placeholder="add person's name"/>
            <div onClick={removeFields} dataindex={dataindex} className="addplus"><RemoveMinusIcon/></div>
        </div>
    )
}