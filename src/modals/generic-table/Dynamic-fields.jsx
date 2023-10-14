import { TrashIcon } from "../../assets/icons";

export default function DynamicFields({removeFields, dataindex}){
    return(
        <div className="worker-dynamic" >
                <input type="text" name={`worker-${dataindex}`} placeholder="name of worker"/>
                <input type="text" name={`foodOrdered-${dataindex}`} placeholder="food ordered"/>
                <div onClick={removeFields} dataindex={dataindex} className="addplus"><TrashIcon/></div>
        </div>
    )
}