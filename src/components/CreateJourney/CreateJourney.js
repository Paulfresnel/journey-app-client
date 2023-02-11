

function CreateJourney(){

    return(
        <div>
            <form>
                <label>
                    <input type='text' name='title'/>
                </label>
                <label>
                    <input type='text' name='description'/>
                </label>
                <label>
                    <input type='text' name='tags'/>
                </label>
                <label>
                    <input type='checkbox' name='isPublic'/>
                </label>
            </form>
        </div>
    )
}

export default CreateJourney