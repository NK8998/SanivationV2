import { useDispatch, useSelector } from "react-redux";
import "./generic-table.css"
import { toggleopenGenericTable } from "../../store/modals-slices/all-modals-controller";
import { getDate } from "../../utilites/get-date";
import { useState } from "react";
import { db } from "../../authentication/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import DynamicFields from "./Dynamic-fields";
import { fetchInitialData } from "../../store/home-slice";
import { AddPlusIcon } from "../../assets/icons";
import toast from "react-hot-toast";



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


        const tableName = `${formData.tableName}_${uniqueTableID}`
         const tableData ={
            ...formData,
            tableName: tableName,
            createdAt: getDate(),
            lastModified: getDate(),
            tableID: uniqueTableID

          }
    
          const tableDocRef = doc(collection(userDocRef, 'tables'), tableName);
          await setDoc(tableDocRef, tableData);

          console.log('Table document written with ID:', tableDocRef.id);
          dispatch(fetchInitialData('', uid))
          toast.success(`${formData.tableName} added`)
        } catch (error) {
          console.error('Error adding documents:', error);
          toast.error(error.message)
        }

  }




  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = document.querySelector('[name="tableName"]').value;

    if(inputValue.trim() === ''){
      toast.error('please give your table a name')
      return
    }
    const formData = new FormData(e.target);
    const formDataObject = { workers: [] };
  
    formData.forEach((value, key) => {
      const uniqueWorkerID = nanoid(6);
      const [field, dataIndex] = key.split('-'); // Split the name attribute to get field and dataIndex
      if (field === "tableName") {
        const tableName = value;
        formDataObject[field] = tableName;
      } else if (field === "worker") {
        if (!formDataObject.workers[dataIndex]) {
          formDataObject.workers[dataIndex] = {};
        }
        formDataObject.workers[dataIndex][field] = value;
  
        formDataObject.workers[dataIndex].createdAt = getDate();
        formDataObject.workers[dataIndex].lastModified = getDate();
        formDataObject.workers[dataIndex].ID = uniqueWorkerID;
      } else if (field === "foodOrdered") {
        // If the field is "foodOrdered," split it by commas
        if (!formDataObject.workers[dataIndex]) {
          formDataObject.workers[dataIndex] = {};
        }
        formDataObject.workers[dataIndex].foodOrdered = value.split(',').map(item => item.trim());
      }
    });
  
    // Convert workers object into an array
    formDataObject.workers = Object.values(formDataObject.workers);
  
    console.log(formDataObject); // Log the grouped form data
    uploadTable(formDataObject)
  };
  
  
    
      
    return(

        <>
        <div className="modal-container generic">
            <div className="top-section">
              <p>Create a table</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="top">
                <p>Table ID (use the format 'Table-01' to make it easier to  identify)</p>
                <input type="text" className="tablename-input" name="tableName" placeholder="name of table"/>
                <p>*separate each entry for food with comas*</p>
                <div className="dynamic-fields-container">
                {dynamicFieldsToBeRendered}
                <div className="addplus" onClick={addFields}><AddPlusIcon/><p>Add field </p></div>

                </div>
                </div>

                <div className="secondary-chin">
                    <button type="button" className="left-button" onClick={()=>{dispatch(toggleopenGenericTable())}}>Cancel</button>
                    <button type="submit" className="right-button">Save</button>
                </div>
            </form>
        </div>
        </>
       
    )
}