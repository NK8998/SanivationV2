import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../authentication/config";
import { getCurrentMonthAndYear } from "../utilites/get-date";
import toast from "react-hot-toast";
import { summarizedTableData } from "./summarizeTableData";
import { convertToExcel } from "./convert-to-excel";

export const getSummaryExcel = async (setIsGeneratingExcel, filterRouteData, allMonthsExcel, uid, chosenMonth, summaryYear)=>{



   if(summaryYear && !chosenMonth){
    toast.error('please enter a month')
    return
   }else if(!summaryYear && chosenMonth){
    toast.error('please enter the year')
    return
   }

   setIsGeneratingExcel(true)


   const userDocRef = doc(db, 'users', uid);
   const allTablesRef = collection(userDocRef, 'tables');


   let tableData;
    if(chosenMonth){
        const lowerMonth = chosenMonth.toLowerCase()
        const month = lowerMonth[0].toUpperCase() + lowerMonth.slice(1)
        const year = parseInt(summaryYear)
        console.log(month, year)
        const q = query(allTablesRef, where('month', '==', `${month}`), where('year', '==', year));

        try {
            const querySnapshot = await getDocs(q);
        
            if (!querySnapshot.empty) {
              tableData = querySnapshot.docs.map((doc) => doc.data());
            } else {
              console.log('No matching documents found.');
              toast(
                "No tables were found.",
                {
                  duration: 6000,
                  position: "top-center"
                }
              );
              setIsGeneratingExcel(false)
    
              return;
            }
          } catch (error) {
            toast.error(error.message)
            setIsGeneratingExcel(false)
    
            // Handle the error here
          }

    }else{
        const {month, year} = getCurrentMonthAndYear()

        if (!allMonthsExcel) {
            const q = query(allTablesRef, where('month', '==', `${month}`), where('year', '==', year));
          
            try {
              const querySnapshot = await getDocs(q);
          
              if (!querySnapshot.empty) {
                tableData = querySnapshot.docs.map((doc) => doc.data());
              } else {
                console.log('No matching documents found.');
                toast(
                  "No tables were found.",
                  {
                    duration: 6000,
                    position: "top-center"
                  }
                );
                setIsGeneratingExcel(false)
      
                return;
              }
            } catch (error) {
              toast.error(error.message)
              setIsGeneratingExcel(false)
      
              // Handle the error here
            }
          } else {
            try {
              const querySnapshot = await getDocs(allTablesRef);
          
              if (!querySnapshot.empty) {
                tableData = querySnapshot.docs.map((doc) => doc.data());
              } else {
                console.log('No matching documents found.');
                toast(
                  "No tables were found. This could be due to network issues. Check your internet connection",
                  {
                    duration: 6000,
                    position: "top-center"
                  }
                );
                setIsGeneratingExcel(false)
                return;
              }
            } catch (error) {
              toast.error(error.message)
              setIsGeneratingExcel(false)
      
              // Handle the error here
            }
          }
    }
    console.log(tableData)

    await convertToExcel(tableData)
    // const summarizedMonthData = summarizedTableData(tableData)



    setIsGeneratingExcel(false)

}