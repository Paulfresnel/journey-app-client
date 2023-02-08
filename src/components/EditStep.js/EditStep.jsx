import { useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"


function EditStep(){

    const {stepId} = useParams()
    console.log(stepId)

    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/steps/${stepId}`)
            .then(response=>{
                console.log(response)
            })
    })

    return(
        <div>

        </div>
    )
}

export default EditStep