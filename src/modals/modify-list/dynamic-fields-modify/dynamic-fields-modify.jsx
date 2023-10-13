
export function DynamicFieldsMoify({removeFields, dataindex}){
    return(
        <div className="worker-dynamic">
        <input type="text" name={`listworker-${dataindex}`} placeholder="add person's name"/>
        <div onClick={removeFields} dataindex={dataindex} className="addplus">remove </div>
    </div>
    )
}