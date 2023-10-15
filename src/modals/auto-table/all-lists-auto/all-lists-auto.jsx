import { useEffect } from "react"
import "./all-lists-auto.css"
import { getUserListThunk, updateChosenList } from "../../../store/modals-slices/auto-table-slice"
import { useDispatch, useSelector } from "react-redux"
import { AddTable, AllYourListsIcon, EditList } from "../../../assets/icons"

export default function AllListsAuto({showLists, setShowLists}){


    const dispatch = useDispatch()
    const userData = useSelector((state)=>state.auth.userData)
    const {uid} = userData

    const lists = useSelector((state)=>state.autoTable.lists)
    const loading = useSelector((state)=>state.autoTable.loading)

    useEffect(()=>{

        dispatch(getUserListThunk(uid))
        

    }, [])

    
    const ListEl = lists.map((list)=>{
        return (
            <>
            <div onClick={()=>{dispatch(updateChosenList(list))}} className="list-option" ><div className="list-letter">{list.listName[0]}</div><p   key={list.listId}>{list.listName}</p><AllYourListsIcon/></div>
            </>
           
        )
    })
    return(
        <div className={`modal-container-lists ${showLists ? 'open' : ''}`}>
            <div className="all-lists-container">
                <div className="close-me-container">
                    <div className="close-me" onClick={()=>{setShowLists((prevState)=>!prevState)}}></div>
                </div>
                <div className="separatr-box"></div>
                
                { loading  ? <p>Loading...</p> : ListEl}
            </div>
          
        </div>
    )
}