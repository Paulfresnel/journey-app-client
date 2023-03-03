import { useState, useEffect } from "react";
import './EditTags.css'

function EditTags(props){

    const { setTagArray, journeyTags, setJourneyTags } = props;
    const [tag, setTag] = useState('');
    const currentTags = [...journeyTags];

    
    const addTag = () => {
       currentTags.push(tag);
       setJourneyTags(currentTags);
       setTag('');
    }  
    
    const removeTag = () => {
        currentTags.splice(currentTags.indexOf(tag));
        setJourneyTags(currentTags);
    }

    useEffect(() => {
         setTagArray(journeyTags);
    }, [journeyTags])
    

    return(
        <>
            <div style={{marginTop: '30px'}}>
                {journeyTags && journeyTags.map(tag => {
                    return (
                            <button style={{marginLeft: '20px', marginRight: '5px', marginBottom: '15px' }} type="button" class="btn btn-primary">
                                {tag} <span class="badge badge-light" onClick={removeTag}>x</span>
                            </button>)
                     })}
            </div>
      
            
            <div className='form-floating mb-3'>
                <input type='text' className='form-control' placeholder='labels' value={tag} onChange={(event)  => setTag(event.target.value)}/>
                <label>Add tag:</label>
            </div>
            <button className='btn btn-primary carousel-btn' type='button' onClick={addTag} style={{paddingTop: '5px'}}>Add tag</button>
            <br/>
        </>
    )

}

export default EditTags;

