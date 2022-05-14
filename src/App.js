import 'regenerator-runtime/runtime'
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { login, logout, goTo } from './utils'
import './global.css'
import logo from './assets/logo-white.svg'
import Home from './Home'
import Raffle from './Raffle'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
    const [showNotification, setShowNotification] = React.useState(false)

    return (
        // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/raffle/:id" element={<Raffle/>}/>
            </Routes>
        </BrowserRouter>
    )
}

function Header(){
    const btn = window.walletConnection.isSignedIn() ? 
        <button onClick={logout}>Sign out</button> :
        <button onClick={login}>Sign in</button>;
    return (
        <header>
            <div className="header-wrapper">
                <img src={logo} onClick={() => goTo('/')}/>
                {btn}
            </div>
        </header>
    )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'setGreeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
