import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../authentication/config";
import { convertMonthDataToPdf } from "./convertTodpf";
import { getCurrentMonthAndYear } from "../utilites/get-date";
import toast from "react-hot-toast";
import { summarizedTableData } from "./summarizeTableData";

export const getSummaryPdf = async (setIsGenerating, filterRouteData, allMonths, uid)=>{
    // get all documents sort by month and give a summary of the totalPlates in each month
    setIsGenerating(true)
    const userDocRef = doc(db, 'users', uid);
    const allTablesRef = collection(userDocRef, 'tables');


    let tableData

    const {month, year} = getCurrentMonthAndYear()

    // console.log(month, year)

    if (!allMonths) {
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
          setIsGenerating(false)

          return;
        }
      } catch (error) {
        toast.error(error.message)
        setIsGenerating(false)

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
            "No tables were found.",
            {
              duration: 6000,
              position: "top-center"
            }
          );
          setIsGenerating(false)
          return;
        }
      } catch (error) {
        toast.error(error.message)
        setIsGenerating(false)

        // Handle the error here
      }
    }
    
   
const summarizedMonthData = summarizedTableData(tableData)

const sortedsummarizedMonthData = filterRouteData(summarizedMonthData, 'true')

// Now, monthArrays contains totalPackets and totalPlates for each month
console.log(sortedsummarizedMonthData);
await convertMonthDataToPdf(sortedsummarizedMonthData)
setIsGenerating(false)

}