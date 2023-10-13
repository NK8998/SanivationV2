import { useDispatch, useSelector } from "react-redux";
import "./generic-table"
import { toggleopenGenericTable } from "../../store/modals-slices/all-modals-controller";
import { getDate } from "../../utilites/get-date";
import { useState } from "react";
import { db } from "../../authentication/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import DynamicFields from "./Dynamic-fields";
import { fetchInitialData } from "../../store/home-slice";



export default function GenericTable(){

    const dispatch = useDispatch()

    
  const userData = useSelector((state)=> state.auth.userData)
  
  const {uid, displayName, email} = userData

    const [allFieldsIDs, setAllFieldsIDs] = useState([]);

    const addFields = () => {
      const uniqueID = nanoid(4);
      setAllFieldsIDs((prevFields) => [...prevFields, uniqueID]);
    };
    
    const removeFields = (e) => {
      const dataIndex = e.target.getAttribute('dataindex');
      console.log(dataIndex);
      setAllFieldsIDs((prevElements) =>
        prevElements.filter((element) => element !== dataIndex)
      );
    };
    
    const dynamicFieldsToBeRendered = allFieldsIDs.map((uniqueID) => {
      return (
        <DynamicFields
          key={uniqueID}
          dataindex={uniqueID}
          removeFields={removeFields}
        />
      );
    });

         
    const uploadTable = async (formData)=>{
  
      const uniqueTableID = nanoid(6)

        const userDocRef = doc(db, 'users', uid); // Replace 'USER_ID' with the actual user's document ID
      
        // Add the user's document
        const userInfo ={
          name: displayName,
          email: email,
        }
        

       
        try {
          await setDoc(userDocRef, userInfo); // Use setDoc to set the user's data
          console.log('User document written with ID:', userDocRef.id);


         const tableData ={
            ...formData,
            createdAt: getDate(),
            lastModified: getDate(),
            tableID: uniqueTableID

          }
    
          const tableDocRef = doc(collection(userDocRef, 'tables'), `${formData.tableName}_${uniqueTableID}`);
          await setDoc(tableDocRef, tableData);

          console.log('Table document written with ID:', tableDocRef.id);
          dispatch(fetchInitialData('', uid))
        } catch (error) {
          console.error('Error adding documents:', error);
        }

  }




  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObject = { workers: [] };

    formData.forEach((value, key) => {
      const uniqueWorkerID = nanoid(6)
      const [field, dataIndex] = key.split('-'); // Split the name attribute to get field and dataIndex
      if (field === "tableName") {
        const tableName  = value
        formDataObject[field] = tableName;
      } else if (field === "worker" || field === "foodOrdered") {
        if (!formDataObject.workers[dataIndex]) {
          formDataObject.workers[dataIndex] = {};
        }
        formDataObject.workers[dataIndex][field] = value;

        formDataObject.workers[dataIndex].createdAt = getDate();
        formDataObject.workers[dataIndex].lastModified = getDate();
        formDataObject.workers[dataIndex].ID = uniqueWorkerID;
      }
    });
  
    // Convert workers object into an array
    formDataObject.workers = Object.values(formDataObject.workers);
  
    console.log(formDataObject); // Log the grouped form data
    uploadTable(formDataObject)
  };
    
      
    return(

        <>
        <div className="auto-bg-black" onClick={()=>{dispatch(toggleopenGenericTable())}}></div>
        <div className="modal-container">
            <p>Create a table</p>
            <form onSubmit={handleSubmit}>
                <div className="top">
                <p>Table ID (use the format 'Table-01' to make it easier to  identify)</p>
                <input type="text" className="tablename-input" name="tableName" placeholder="name of table"/>
                <p>*separate each entry for food with comas*</p>
                <div className="dynamic-fields-container">
                {dynamicFieldsToBeRendered}
                </div>
                <div className="addplus" onClick={addFields}>add <p>Add field </p></div>
                </div>
                <div className="modal-bottom">
                    <button type="button" className="left-button" onClick={()=>{dispatch(toggleopenGenericTable())}}>Cancel</button>
                    <button type="submit" className="right-button">Save</button>
                </div>
            </form>
        </div>
        </>
       
    )
}