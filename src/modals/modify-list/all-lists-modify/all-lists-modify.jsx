import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserListsThunk, updateChosenList } from "../../../store/modals-slices/modify-list-slice"

export default function AllListsModify(){

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
            <p onClick={()=>{dispatch(updateChosenList(list))}} key={list.listId}>{list.listName}</p>
        )
    })

    return(
        <div className="secondary-modal-continer">

            { loading  ? <p>Loading...</p> : ListEl}

        </div>
    )
}