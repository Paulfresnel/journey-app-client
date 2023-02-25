import { useState, useEffect } from "react";

function EditTags(props){ 

    const { tag, setTag, tagArray, setTagArray, allTags, setEditTags} = props;

    useEffect(() => {
        setTagArray(allTags)
        console.log(tagArray)
    }, [])

    const handleTags = (event) => {
        let thisTag = event.target.value;
        allTags.splice(allTags.indexOf(thisTag),1);
        setTagArray(allTags)
    }


    return(
        <div>
            <div>
                {tagArray.map(tag => {
                    return( 
                        <div>
                            <h2>{tag}</h2><button id='remove-tag-button' type='button' value={tag} onClick={(event) => {setEditTags(true); handleTags(event); }}>x</button>
                        </div>)
                })}
            </div>
        </div>


    )

}

export default EditTags;