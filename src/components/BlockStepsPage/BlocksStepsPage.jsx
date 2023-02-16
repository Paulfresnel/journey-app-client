import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import CreateStep from "../CreateStep/CreateStep"
import axios from "axios"

function BlocksStepsPage(){

   

    const {blockId} = useParams()
    const [block, setBlock]= useState({title:"", description:"", category:"", importance:"",step:[{}]})
    const [isLoading,setIsLoading] = useState(true)
    const [showCreateStep,setShowCreateStep] = useState(false)
    const [step, setStep] = useState({title:"", description: "", category:"", difficulty:"", importance:"", image:"", links:[{name:"", link:""}], notes:[""]})


    const [validationMessage, setValidationMessage] = useState('')

    const deleteStep = async (e)=>{
        const stepId = e.target.value
      await  axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/steps/${stepId}`)
            .then(async(response)=>{
             await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/blocks/${blockId}`)
                .then(blockResponse=>{
                    const updatedBlock = blockResponse.data.block
                console.log("api response:")
                console.log(updatedBlock) 
                setValidationMessage(response.data.message)
                setBlock(updatedBlock)
               
                })
                
            })
    }

    const showCreateStepForm = () =>{
        setShowCreateStep(!showCreateStep)
    }


    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/blocks/${blockId}`)
            .then(response=>{
                const data = response.data.block
                setBlock(data)
                setIsLoading(false)
            })
    },[blockId])

    console.log("consoel loggin block")
    console.log(block)

    return(
        <div>
        {isLoading ? <p>Loading...</p>
        : <div>
        <h1>Learning Block Concept: {block.title}</h1>
        <h2>Description: {block.description}</h2>
        <h3>Category: {block.category}</h3>
        <h4>Importance of Learning Block for overall Journey: {block.importance}</h4>
            <div>
                <h1>Block's Edition Page</h1>
                <h2>Step's Creation Page</h2>
            </div>
            { block.steps.length >0 && <div>
                <h3>Current Steps in the Learning Block:</h3>
                <table className="steps-table">
                    <thead>
                        <tr>
                            <td>Step #</td>
                            <td>Title</td>
                            <td></td>
                            <td></td>
                            <td></td>

                        </tr>
                    </thead>
                    <tbody>
                        {block.steps.map((step, index)=>{
                            return <tr key={step._id}>
                                <td>{index+1}</td>
                                <td>{step.title}</td>
                                <td>
                                <Link to={`/edit-step/${step._id}`}>
                                <button>More Info</button>
                                </Link>
                            </td>
                            <td>
                                <button onClick={(e)=>deleteStep(e)} value={step._id}>Delete</button>
                            </td>
                            <td>
                            {step.isCompleted ? <input type="checkbox" checked></input> : <input type="checkbox"></input>}
                            </td>
                            <td><p>Is Completed?</p></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {validationMessage && <p style={{color:"green", fontWeight:"bold"}}>{validationMessage}</p>}
            </div>}
            <button onClick={showCreateStepForm}>Show Create Step</button>
            {showCreateStep ? <CreateStep block={block} setBlock={setBlock} step={step} setStep={setStep}/> : <div></div>}
            </div>
        }
        </div>
    )
}

export default BlocksStepsPage