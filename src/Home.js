import 'regenerator-runtime/runtime'
import React from 'react'
import { getActiveRaffles, getNFTs, goTo } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function Home(){
    const [activeLotos, setActiveLotos] = React.useState([])

    const [accountNFTs, setAccountNFTs] = React.useState([])
    
    React.useEffect(
        () => {
            getActiveRaffles().then(
                data => setActiveLotos(data)
            )
        // in this case, we only care to query the contract when signed in
            if (window.walletConnection.isSignedIn()) {
                // window.contract is set by initContract in index.js

                getNFTs(networkId, window.accountId)
                .then(nfts => setAccountNFTs(nfts))
            }
        },

        // The second argument to useEffect tells React when to re-run the effect
        // Use an empty array to specify "only run on first render"
        // This works because signing into NEAR Wallet reloads the page
        []
    )

    if (!window.walletConnection.isSignedIn()) {
        return (
            <main className="wrapper">
                <h1>Welcome to NEAR!</h1>
                <p>
                To make use of the NEAR blockchain, you need to sign in. The button
                below will sign you in using NEAR Wallet.
                </p>
                <p>
                By default, when your app runs in "development" mode, it connects
                to a test network ("testnet") wallet. This works just like the main
                network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
                convertible to other currencies – they're just for testing!
                </p>
                <p>
                Go ahead and click the button below to try it out:
                </p>
                <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
                </p>
            </main>
        )
    }

    return (
        // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
        <main className="wrapper">
            <h1>{'Hello, '}{window.accountId}!</h1>
            <h2>Active Raffles</h2>
            <LotoCardHolder activeLotos={activeLotos}/>
            <h2>Your NFT's</h2>
            <NFTCardHolder nfts={accountNFTs}/>
            
        </main>
    )
}

function LotoCard(props){
    return (
        <div className="card" onClick={() => goTo(`/raffle/${props.id}`)}>
            <div className="cardTitle">Test</div>
            <div className="cardBody">
                <p>Participants: {props.loto.participants_number}</p>
                <p>Creator: {props.loto.creator}</p>
                <p>TicketPrice: {props.loto.ticket_price}</p>
            </div>
        </div>
    )
}

function LotoCardHolder(props) {
    let content = []
    for(let i = 0; i < props.activeLotos.length; i++){
        const id = props.activeLotos[i][0];
        const loto = props.activeLotos[i][1];
        content.push(<LotoCard key={id} id={id} loto={loto}/>)
    }
    return (
        <div className="cardHolder">
            {content}
        </div>
    )
}
function NFTCardHolder(props) {
    let content = []
    if(props.nfts.length == 0){
        content.push(<p key="no-tokens">NFT's are not found or loading...</p>)
    }else{
        for(let i = 0; i < props.nfts.length; i++){
            const nft = props.nfts[i]
            const id = `${nft.contract}/${nft.data.token_id}`
            content.push(<NFTCard key={id} nft={nft}/>)
        }
    }
    return (
        <div className="cardHolder">
            {content}
        </div>
    )
}
function NFTCard(props){
    return (
        <div className="nftCard card">
            <div className="cardTitle">{props.nft.data.metadata.title}</div>
            <img src={props.nft.data.metadata.media}/>
            <div className="cardBody">
                <p>Description: {props.nft.data.metadata.description}</p>
            </div>
        </div>
    )
}

