import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTotalizer } from "../../../store/modals-slices/auto-table-slice";


export default function Totalizer({setTotalizerOpen, totalizerOpen, removedWorkerIDs}){

    const chosenList = useSelector((state)=>state.autoTable.chosenList)
    const dispatch = useDispatch()
    const newArrray = []
    let totalPackets = 0

    const newChosenList =  {...chosenList}

    newChosenList.workers = newChosenList.workers.filter((worker)=> !removedWorkerIDs.includes(worker.ID))

    newChosenList?.workers?.map((worker)=>{
      let workerFoodArray = [...worker.foodOrdered]
    
      const filteredArrray =   workerFoodArray.filter(food=> !food.includes(' milk '))

        for(let i = 0; i < worker.totalPackets; i++){
          filteredArrray.push('milk')
        }
        
        worker.totalPackets && (totalPackets += worker.totalPackets)

       
        
        newArrray.push(...filteredArrray)
    })
    
   const filteredNewArray =  newArrray.map((food)=> {return food.trim()})
    const foodObj = filteredNewArray.reduce((result, food) => {
        if (food!== '') { // Check if food is not an empty string
          if (!result[food]) {
            result[food] = 1; // Initialize count to 1 for the first occurrence
          } else {
            result[food]++; // Increment count for subsequent occurrences
          }
        }
        return result;
      }, {});

      let foodCountArray = []
      
      // Convert the result object to an array of objects
      foodCountArray = Object.keys(foodObj).map((foodName) => ({
        food: foodName,
        count: foodObj[foodName],
      }));

      const totalizerFoodObj ={
        totalPackets: totalPackets,
        totalPlates: newChosenList?.workers?.length,
        foodCountArray: foodCountArray

      }

      console.log(totalizerFoodObj)

      useEffect(()=>{

        dispatch(updateTotalizer(totalizerFoodObj))

    }, [chosenList])
      
      const foodEl = foodCountArray.map((food)=>{
        return (
            <div className="total-foods-container" key={food.food}>
            <p>{food.food}</p>
            <p>{food.count}</p>
            </div>
        )
      })

    return(
      <>
      <div className={`totalizer-bg ${totalizerOpen ? 'open' : ''}`} onClick={()=>{setTotalizerOpen((prevState)=>!prevState)}}></div>
        <div className={`totalizer ${totalizerOpen ? 'open' : ''}`}>
            <p className="title">Total</p>
            <div className="upper-total-container">
                <p>food</p>
                <p>count</p>
            </div>
            {foodEl}
        </div>
        </>
    )
}