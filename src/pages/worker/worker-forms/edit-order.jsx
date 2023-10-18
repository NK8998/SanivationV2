import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { handleSubmitOrdersThunk } from "../../../store/worker-slice"
import { useEffect, useState } from "react"
import { getDate } from "../../../utilites/get-date"

export default function EditOrder({workerID, startEditingOrders}){

    const workerData = useSelector((state)=>state.worker.workerData)
    const userData = useSelector((state)=> state.auth.userData)
    const tableData = useSelector((state)=>state.worker.tableData)
    const {uid} = userData
    const dispatch = useDispatch()

    const [mainDishes, setMainDishes] = useState([' Ugali', ' Chapati', ' Rice'])
    const [supplementDishes, setSupplementDishes] = useState([' Matumbo', ' meat'])
    const [greenDishes, setGreenDishes] = useState([' cabbage', ' managu', ' sukuma'])
    const [drinksDish, setDrinksDish] = useState([' milk'])

    const [main, setMain] = useState('')
    const [supplement, setSupplement] = useState('')
    const [greens, setGreens]  = useState('')
    const [drinks, setDrinks] = useState('')
    const [totalPackets, setTotalPackest] = useState(0)


    useEffect(()=>{
       
        workerData.foodOrdered.map((food, index)=>{
            if(index === 0){
                setMain(food)
            }else if(index === 1){
                setSupplement(food)
            }else if(index === 2){
                setGreens(food)
            }else if(index === 3){
                const drink = food.split(' ')[1]
                setTimeout(()=>{
                    setDrinks(` ${drink}`)
                }, 100)
                
              
           
            }
            
        })
        setTimeout(()=>{
            workerData.totalPackets ?  setTotalPackest(workerData.totalPackets) : setTotalPackest(0)
        }, 100)
      
       
       

    }, [])

    const mainDishesEl = mainDishes.map((mainFood)=>{
        return(
            <button type="button" key={mainFood} onClick={()=> main === mainFood ? setMain('') :  setMain(mainFood)} className={`${mainFood === main ? 'active' : ''}`}>{mainFood}</button>
        )
    })

    const supplementDishesEl = supplementDishes.map((supplementFood)=>{
        return(
            <button type="button" key={supplementFood} onClick={()=>supplement === supplementFood ? setSupplement('') : setSupplement(supplementFood)} className={`${supplementFood === supplement ? 'active' : ''}`}>{supplementFood}</button>
        )
    })

    const greenDishesEl = greenDishes.map((greenFood)=>{
        return(
            <button type="button" key={greenFood} onClick={()=> greens === greenFood ? setGreens('') : setGreens(greenFood)} className={`${greenFood === greens ? 'active' : ''}`}>{greenFood}</button>
        )
    })

    const addDrink = (drinkDish)=>{
        setTotalPackest((count)=> count + 1)
        setDrinks(drinkDish)
    }

    const drinksEl = drinksDish.map((drinkDish)=>{
        return(
            <>
            <button type="button" key={drinkDish}  className={`${drinkDish === drinks ? 'active' : ''}`}>{drinkDish}</button>
            <div className="winder-container">
                <button type="button" onClick={()=>{totalPackets > 0 && setTotalPackest((count)=> count - 1)}}>-</button>
                {drinkDish === drinks  ? totalPackets : 0}
                <button type="button" onClick={()=>{addDrink(drinkDish)}}>+</button>
            </div>
            </>
        )
    })

    const foodOrdered = [main, supplement, greens, `${drinks} ${drinks.length > 0  ? `(${totalPackets})` : ''}`]

    useEffect(()=>{

        totalPackets === 0 && setDrinks('')
    }, [totalPackets])

    const handleSubmitOrders = (e)=>{
        e.preventDefault()
       
        let newWorkerObj = {...workerData}
        newWorkerObj.totalPackets = totalPackets
        newWorkerObj.lastModified = getDate()
        newWorkerObj.foodOrdered = foodOrdered
    

        dispatch(handleSubmitOrdersThunk(newWorkerObj, tableData, uid, workerID))
    }
    return(
        <>
        <div className="editing-orders-bg" onClick={startEditingOrders}></div>
        <form onSubmit={(e)=>handleSubmitOrders(e)} className="editing-orders">
            <div className="form-middle">
            <div className="editing-orders-picker">
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
                </div>
            </div>
            <div className="modal-bottom">
                <button type="button" onClick={startEditingOrders}>Cancel</button>
                <button type="submit">Update</button>
            </div>
        </form>
        </>

    )
}