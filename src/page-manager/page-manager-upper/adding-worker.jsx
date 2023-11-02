import { useEffect, useState } from "react"

export default function AddingWorker({toggleAddingWorkerModal, addWorker, isSubmitting}){

    const [mainDishes, setMainDishes] = useState([' Ugali', ' Chapati', ' Rice', ' Chips'])
    const [supplementDishes, setSupplementDishes] = useState([' Matumbo', ' Meat', ' Maharagwe', ' Kamande'])
    const [greenDishes, setGreenDishes] = useState([' Cabbage', ' Managu', ' Sukuma'])
    const [drinksDish, setDrinksDish] = useState([' milk'])
    const [extraDish, setEtraDish] = useState([' Viazi'])

    const [main, setMain] = useState('')
    const [supplement, setSupplement] = useState('')
    const [greens, setGreens]  = useState('')
    const [drinks, setDrinks] = useState('')
    const [extra, setExtra] = useState('')

    const [totalPackets, setTotalPackest] = useState(0)

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

    const extraEl =  extraDish.map((extraFood)=>{
        return(
            <button key={extraFood} onClick={()=> extra === extraFood ? setExtra('') :  setExtra(extraFood)} className={`${extraFood === extra ? 'active' : ''}`}>{extraFood}</button>
        )
    })

    const foodOrdered = [main, supplement, greens, `${drinks} ${drinks.trim().length > 0  ? `(${totalPackets})` : ''}`, extra]

    useEffect(()=>{

        totalPackets === 0 && setDrinks('')
    }, [totalPackets])

    return(
        <>
        <div className="bg-black-adding" onClick={toggleAddingWorkerModal}></div>
        <div className="adding-worker-modal">
            <form onSubmit={(e)=>addWorker(e, foodOrdered, totalPackets)}>
                <p className="top-p">Add worker</p>
                <div className="input-div">
                    <input type="text" name="addWorker" placeholder="add worker" />
                </div>
                <div className="adding-worker-picker">
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
                </div>
                <div className="modal-bottom">
                    <button type="button" className="left-button" onClick={toggleAddingWorkerModal}>Cancel</button>
                    {isSubmitting ?
                    <button type="button" className="right-button loading"><div className="loader"></div></button>
                    :
                    <button type="submit" className="right-button">Add</button>}
                </div>
            </form>

        </div>
        </>
    )
}