import { useState, useEffect } from "react";

function EditTags(props){

    const { setTagArray } = props;
    const [journeyTags, setJourneyTags] = useState([]);
    const [tag, setTag] = useState('');
    const currentTags = [...journeyTags];
    console.log(currentTags);
    
    const addTag = () => {
       currentTags.push(tag);
       setJourneyTags(currentTags);
    }  
    
    const removeTag = () => {
        currentTags.splice(currentTags.indexOf(tag));
        setJourneyTags(currentTags);
    }

    useEffect(() => {
        setTagArray(journeyTags)
    },[journeyTags])

    return(
        <>
            <div>
                {journeyTags && journeyTags.map(tag => {
                    return(
                            <button type="button" class="btn btn-primary">
                                {tag} <span class="badge badge-light" onClick={removeTag}>x</span>
                            </button>)
                     })}
            </div>
            <label>Add tags:</label>
            <div>
                <input type='text' onChange={(event) => setTag(event.target.value)}/>
                <button type='button' onClick={addTag}>Add tag</button>
            </div>
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

