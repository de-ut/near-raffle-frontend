import 'regenerator-runtime/runtime'
import React from 'react'
import { useParams } from "react-router-dom";
import { getRaffle, getNFT, enterRaffle } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function Raffle({match}){
    const id = parseInt(useParams().id)
    const [raffleData, setRaffleData] = React.useState()
    const [rafflePrize, setRafflePrize] = React.useState()

    React.useEffect(
        () => {
        // in this case, we only care to query the contract when signed in
            getRaffle(id).then(
                data => {
                    setRaffleData(data)
                    getNFT(data.prize.smart_contract, data.prize.id).then(
                        nft => {
                            setRafflePrize(nft)
                        }
                    )                  
                }
            )
                // window.contract is set by initContract in index.js   
        },

        // The second argument to useEffect tells React when to re-run the effect
        // Use an empty array to specify "only run on first render"
        // This works because signing into NEAR Wallet reloads the page
        []
    )
    if(raffleData == undefined){
        return <p>Loading...</p>
    }
    let nft = <p>"Loading..."</p>
    if(rafflePrize != undefined){
        nft = <RafflePrizeNFT nft={rafflePrize} contract={raffleData.prize.smart_contract}/>
    }
    const participants = raffleData.participants.map((p, i) => <li key={i}><a href={`https://wallet.testnet.near.org/profile/${p}`}>{p}</a></li>)
    return (
        <main style={{"textAlign": "center"}}>
            <h1>Raffle #{id}</h1>
            <button onClick={enterRaffle}>JOIN</button>
            <h2>Info</h2>
            <p>Creator - <a href={`https://wallet.testnet.near.org/profile/${raffleData.creator}`}>{raffleData.creator}</a></p>
            <p>Participants - {participants.length}/{raffleData.participants_number}</p>
            <p>Winner - {raffleData.winner == null ? "None" : raffleData.winner}</p>
            <p>TicketPrice - {raffleData.ticket_price}</p>
            <h2>Prize</h2>
            {nft}
            <h2>Participants: </h2>
            <ul style={{"listStyleType": "none", "padding": 0}}>
                {participants}
            </ul>
        </main>
    )
}

function RafflePrizeNFT(props){
    return (
        <div className="prizeNFT">
            <img className="media" src={props.nft.metadata.media}/>
            <div className="info">
                <p>Title: {props.nft.metadata.title}</p>
                <p>Description: {props.nft.metadata.description}</p>
                <p>Contract: {props.contract}</p>
            </div>
        </div>
    )
}