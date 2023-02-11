function EditTags(props){

    const {tagArray, setTagArray} = props;

    const handleTags = (event) => {
        const allTags = [...tagArray]
        let thisTag = event.target.value;
        allTags.splice(allTags.indexOf(thisTag),1);
        setTagArray(allTags)
    }

    return(
        tagArray.map(tag => {
            return( 
                <div>
                    <h2>{tag}</h2><button type='button' value={tag} onClick={(event) => handleTags(event)}>x</button>
                </div>)
        })
    )

}

export default EditTags;