import { useDispatch, useSelector } from "react-redux";
import { getDate } from "../../utilites/get-date";
import "./add-list.css"
import DynamicFieldsList from "./dynamic-fields/dynamic-fields-list";
import { nanoid } from "nanoid";
import { toggleOpenLists } from "../../store/modals-slices/all-modals-controller";
import { useState } from "react";
import { db } from "../../authentication/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { AddPlusIcon } from "../../assets/icons";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function AddList(){

    const [searchParams, setSearchParams] = useSearchParams()

    const dispatch = useDispatch()

    const userData = useSelector((state)=> state.auth.userData)
  
    const {uid, displayName, email} = userData

    const [allFieldsIDs, setAllFieldsIDs] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false)

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
        <DynamicFieldsList
          key={uniqueID}
          dataindex={uniqueID}
          removeFields={removeFields}
        />
      );
    });

    const handleSubmit = (e)=>{
        e.preventDefault()
      

        const inputValue = document.querySelector('[name="listName-input"]').value;
        if(inputValue.trim() === ''){
          toast.error('please give your list a name')
          return
        }
        setIsSubmitting(true)
        const listID = nanoid(6)
        const formData = new FormData(e.target);
        let formDataObject = { workers: [] };
      
        formData.forEach((value, key) => {
          const uniqueID = nanoid(6)
          const [field, dataIndex] = key.split('-'); // Split the name attribute to get field and dataIndex
          if (field === "listName") {
            formDataObject[field] = value;
          } else if (field === "listworker") {
            if (!formDataObject.workers[dataIndex]) {
              formDataObject.workers[dataIndex] = {};
            }
            formDataObject.workers[dataIndex][field] = value;
  
            formDataObject.workers[dataIndex].createdAt = getDate();
            formDataObject.workers[dataIndex].lastModified = getDate();
            formDataObject.workers[dataIndex].ID = uniqueID;
            formDataObject.workers[dataIndex].foodOrdered = []
          }
        });

        formDataObject.workers = Object.values(formDataObject.workers);

        formDataObject = {...formDataObject, listId:listID}

        console.log(formDataObject)
        uploadList(formDataObject)

    }

    const uploadList = async (formData)=>{
  

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
          }
    
          const tableDocRef = doc(collection(userDocRef, 'lists'), formData.listName);
          await setDoc(tableDocRef, tableData);
          toast.success(`${formData.listName} list added`)
          console.log('List document written with ID:', tableDocRef.id);
          setIsSubmitting(false)

        
        } catch (error) {
          console.error('Error adding documents:', error);
          toast.error(error.message)
          setIsSubmitting(false)

        }

  }

  const updateModal = (modalValue) => {
    // Create a new search parameters object and set the 'modal' parameter to the new value
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('modal', modalValue);
  
    // Replace the entire search parameters with the updated one
    setSearchParams(newSearchParams, {replace: true});
  };


    return(

        <>
        <div className="modal-container">
            <div className="top-section adding">
                <p>Create your lists to save time.</p>
                <p>*Each list can be used to preload data.</p>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
                <div className="top">
                    <p>Add list name</p>
                    <input type="text" name="listName-input" placeholder="list name"/>

                </div>
                
                <div className="dynamic-container">
                    <p>Add as many fields as you wish</p>
                    {dynamicFieldsToBeRendered}
                    <div className="addplus" onClick={addFields}><AddPlusIcon/> <p>add field </p></div>

                </div>

            <div className="secondary-chin">
                <button type="button"className="left-button" onClick={()=>updateModal('')}>Cancel</button>

                {isSubmitting ?
                  <button type="button" className="right-button loading"><div className="loader"></div></button>
                  :
                  <button type="submit"className="right-button">Save</button>}
            </div>
            </form>

        </div>
        </>
   
    )
}