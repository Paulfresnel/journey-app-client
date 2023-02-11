import { useState } from "react"
import { Link } from "react-router-dom"
import CreateStep from "../CreateStep/CreateStep"
import axios from "axios"

function BlocksStepsPage(){

    const [validationMessage, setValidationMessage] = useState('')

    const deleteStep = (e)=>{
        const stepId = e.target.value
        console.log(stepId)
        axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/steps/${stepId}`)
            .then(response=>{
                console.log(response.data.message)
                setValidationMessage(response.data.message)
            })
    }

    return(
        <div>
            <div>
                <h1>Block's Edition Page</h1>
                <h2>Step's Creation Page</h2>
            </div>
            <div>
                <h3>Current Steps in the Learning Block:</h3>
                <table className="steps-table">
                    <thead>
                        <tr>
                            <td>Step #</td>
                            <td>Title</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Leaning javascript</td>
                            <td>
                            <Link to={"/edit-step/63e403947b21639c6d7398eb"}>
                                <button>More Info</button>
                                </Link>
                            </td>
                            <td>
                                <button onClick={(e)=>deleteStep(e)} value="63e76eb4f26a4995d0dbd22c">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {validationMessage && <p style={{color:"green", fontWeight:"bold"}}>{validationMessage}</p>}
            </div>
            <CreateStep/>
        </div>
    )
}

export default BlocksStepsPage