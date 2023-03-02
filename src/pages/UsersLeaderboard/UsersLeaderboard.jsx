import { useState } from "react"
import UsersLeadBoard from "../../components/UsersLeadBoard/UsersLeadBoard"
import JourneysLeadBoard from "../../components/JourneysLeadBoard/JourneysLeadBoard"
import './UsersLeaderboard.css'


function UserLeaderboard(){

    const [blockToShow, setBlockToShow] = useState('users')
    return(
        <div className="margin-top margined">
        <h2 className="colored margin-top"><span className="quest-font emphasized">U</span>sers <span className="quest-font emphasized">&</span> <span className="quest-font emphasized">J</span>ourneys <span className="quest-font emphasized">L</span>eaderboard</h2>
            <div className="margin-top margin-b">
                <button className="btn btn-outline-success bold margin-r" onClick={()=>setBlockToShow('users')}>Users</button>
                <button className="btn btn-outline-success bold"  onClick={()=>setBlockToShow('journeys')}>Journeys</button>
            </div>
            <div className="div-block margin-r-l"/>
        {blockToShow=== 'users' && <div>
            <UsersLeadBoard/>
        </div>}
        {blockToShow=== 'journeys' && <div>
            <JourneysLeadBoard/>
        </div>}

        </div>
    )

}

export default UserLeaderboard