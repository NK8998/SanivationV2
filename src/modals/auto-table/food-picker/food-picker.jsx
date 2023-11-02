import { useDispatch, useSelector } from "react-redux"
import "./food-picker.css"
import { useEffect, useState } from "react"
import { updateChosenList } from "../../../store/modals-slices/auto-table-slice"

export default function FoodPicker({toggleFoodPicker}){

    const dispatch = useDispatch()
    const [mainDishes, setMainDishes] = useState([' Ugali', ' Chapati', ' Rice', ' Chips'])
    const [supplementDishes, setSupplementDishes] = useState([' Matumbo', ' Meat', ' Maharagwe', ' Kamande', ' Ndengu'])
    const [greenDishes, setGreenDishes] = useState([' Cabbage', ' Managu', ' Sukuma'])
    const [drinksDish, setDrinksDish] = useState([' milk'])
    const [extraDish, setEtraDish] = useState([' Viazi'])

    const [main, setMain] = useState('')
    const [supplement, setSupplement] = useState('')
    const [greens, setGreens]  = useState('')
    const [drinks, setDrinks] = useState('')
    const [extra, setExtra] = useState('')
    const [totalPackets, setTotalPackest] = useState(0)

    const currentWorker = useSelector((state)=> state.autoTable.currentWorker)
    const chosenList = useSelector((state)=> state.autoTable.chosenList)
    const foodPickerOpen = useSelector((state)=>state.autoTable.foodPickerOpen)
  

    useEffect(()=>{
        if(currentWorker && currentWorker?.foodOrdered?.length > 0){
                currentWorker.foodOrdered.map((food, index)=>{
                    if(index === 0){
                        setMain(food)
                    }else if(index === 1){
                        setSupplement(food)
                    }else if(index === 2){
                        setGreens(food)
                    }else if(index === 3){
                        const drink = food.split(' ')[1]
                        setDrinks(` ${drink}`)
                    
                
                    }else if(index === 4){
                        setExtra(food)
                    }
                    
                })
                setTotalPackest(currentWorker.totalPackets)
        }else{
            setMain('')
            setGreens('')
            setSupplement('')
            setDrinks('')
            setTotalPackest(0)
            setExtra('')
        }
    
    }, [currentWorker])

    const mainDishesEl = mainDishes.map((mainFood)=>{
        return(
            <button key={mainFood} onClick={()=> main === mainFood ? setMain('') :  setMain(mainFood)} className={`${mainFood === main ? 'active' : ''}`}>{mainFood}</button>
        )
    })

    const supplementDishesEl = supplementDishes.map((supplementFood)=>{
        return(
            <button key={supplementFood} onClick={()=>supplement === supplementFood ? setSupplement('') : setSupplement(supplementFood)} className={`${supplementFood === supplement ? 'active' : ''}`}>{supplementFood}</button>
        )
    })

    const greenDishesEl = greenDishes.map((greenFood)=>{
        return(
            <button key={greenFood} onClick={()=> greens === greenFood ? setGreens('') : setGreens(greenFood)} className={`${greenFood === greens ? 'active' : ''}`}>{greenFood}</button>
        )
    })

    const addDrink = (drinkDish)=>{
        setTotalPackest((count)=> count + 1)
        setDrinks(drinkDish)
    }

    const drinksEl = drinksDish.map((drinkDish)=>{
        return(
            <>
            <button key={drinkDish}  className={`${drinkDish === drinks ? 'active' : ''}`}>{drinkDish}</button>
            <div className="winder-container">
                <button onClick={()=>{totalPackets > 0 && setTotalPackest((count)=> count - 1)}}>-</button>
                {drinkDish === drinks  ? totalPackets : 0}
                <button onClick={()=>{addDrink(drinkDish)}}>+</button>
            </div>
            </>
        )
    })

    const extraEl =  extraDish.map((extraFood)=>{
        return(
            <button key={extraFood} onClick={()=> extra === extraFood ? setExtra('') :  setExtra(extraFood)} className={`${extraFood === extra ? 'active' : ''}`}>{extraFood}</button>
        )
    })

    const updateCurrentList=()=>{
        let newWorkerObj = {...currentWorker};

        
        newWorkerObj.foodOrdered = [main, supplement, greens, `${drinks} ${drinks.trim().length > 0  ? `(${totalPackets})` : ''}`]

        console.log(newWorkerObj.foodOrdered)
        let newChosenListObj = { ...chosenList };

        newChosenListObj.workers = newChosenListObj.workers.map((worker) => {
          if (worker.ID === newWorkerObj.ID) {
            console.log('found');
            return { ...newWorkerObj, totalPackets: totalPackets}; // Replace the matching worker with the updated one
          }
        
          return worker;
        });
      
        

        dispatch(updateChosenList(newChosenListObj))
        toggleFoodPicker('')

    }

    useEffect(()=>{

        totalPackets === 0 && setDrinks('')

    }, [totalPackets])

    return(
     <>
        <div className={`bg-top-black ${foodPickerOpen ? "open" : ''}`} onClick={()=>{toggleFoodPicker('')}}></div>
        <div className={`secondary-modal-container ${foodPickerOpen ? "open" : ''}`}>

                <div className="upper-modal">
                <p>{currentWorker.listworker}</p>
                </div>

                <div className="Main picker">
                    <p>Main</p>
                    <div className="picker-container">
                     {mainDishesEl}
                    </div>
             
                </div>
                <div className="Supplement picker">
                    <p>Supplement</p>
                    <div className="picker-container">
                      {supplementDishesEl}
                    </div>
           
                </div>
                <div className="greens picker">
                    <p>Greens</p>
                    <div className="picker-container">
                    {greenDishesEl}
                    </div>
                </div>
                <div className="drinks picker">
                    <p>Drinks</p>
                    <div className="picker-container">
                      {drinksEl}  
                    </div>
               
                </div>
                <div className="extra picker">
                    <p>Extra</p>
                    <div className="picker-container">
                        {extraEl}
                    </div>
                </div>

                <div className="modal-bottom">
                    <button className="left-button"onClick={()=>{toggleFoodPicker('')}}>Cancel</button>
                    <button className="right-button" onClick={updateCurrentList}>Save</button>
                </div>

        </div>
        </>

    )
}
