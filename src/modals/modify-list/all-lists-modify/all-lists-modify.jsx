import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserListsThunk, updateChosenList } from "../../../store/modals-slices/modify-list-slice"
import { AllYourListsIcon } from "../../../assets/icons"

export default function AllListsModify({showLists, setShowLists}){

    const dispatch = useDispatch()
    const userData = useSelector((state)=> state.auth.userData)
    const {uid} = userData
    const lists = useSelector((state)=> state.modifyList.lists)
    const loading = useSelector((state)=> state.modifyList.loading)


    useEffect(()=>{

        
        // fetch lists
        dispatch(getUserListsThunk(uid))


    }, [])


    
    const ListEl = lists.map((list)=>{
        return (
           <div className="list-option" onClick={()=>{dispatch(updateChosenList(list)); setShowLists((prevState)=>!prevState)}}><div className="list-letter">{list.listName[0]}</div><p  key={list.listId}>{list.listName}</p><AllYourListsIcon/></div> 
        )
    })

    return(
        <div className={`modal-container-lists ${showLists ? 'open' : ''}`}>
            <div className="all-lists-container">
                <div className="close-me-container">
                    <div className="close-me" onClick={()=>{setShowLists((prevState)=>!prevState)}}>close</div>
                </div>
                <div className="separatr-box"></div>
                
                { loading  ? <p>Loading...</p> : ListEl}
            </div>
        </div>
    )
}