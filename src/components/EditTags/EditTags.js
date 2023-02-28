import { useState, useEffect } from "react";
import './EditTags.css'

function EditTags(props){

    const { setTagArray, journeyTags, setJourneyTags } = props;
    const [tag, setTag] = useState('');
    const currentTags = [...journeyTags];
    console.log(journeyTags);
    
    const addTag = () => {
       currentTags.push(tag);
       setJourneyTags(currentTags);
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
            <div>
                {journeyTags && journeyTags.map(tag => {
                    return (
                            <button type="button" class="btn btn-primary">
                                {tag} <span class="badge badge-light" onClick={removeTag}>x</span>
                            </button>)
                     })}
            </div>
      
            
            <div className='form-floating mb-3'>
                <input type='text' className='form-control' placeholder='labels' onChange={(event) => setTag(event.target.value)}/>
                <label>Add tag:</label>
            </div>
            <button className='btn btn-primary carousel-btn' type='button' onClick={addTag} style={{paddingTop: '5px'}}>Add tag</button>
            <br/>
        </>
    )

    // const { tag, setTag, tagArray, setTagArray, allTags, setEditTags} = props;

    // useEffect(() => {
    //     setTagArray(allTags)
    //     console.log(tagArray)
    // }, [])

    // const handleTags = (event) => {
    //     let thisTag = event.target.value;
    //     allTags.splice(allTags.indexOf(thisTag),1);
    //     setTagArray(allTags)
    // }


    // return(
    //     <div>
    //         <div>
    //             {tagArray.map(tag => {
    //                 return( 
    //                     <div>
    //                         <h2>{tag}</h2><button id='remove-tag-button' type='button' value={tag} onClick={(event) => {setEditTags(true); handleTags(event); }}>x</button>
    //                     </div>)
    //             })}
    //         </div>
    //     </div>


    // )

}

export default EditTags;

