import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.raffleContract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_raffle_by_id', 'active_raffles'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['join_raffle', 'nft_transfer_call'],
  })

  console.log(raffleContract)
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function getRaffle(raffleID){
    const raffle = await window.raffleContract.get_raffle_by_id({raffle_id: raffleID})
    return raffle
}

export async function enterRaffle(raffleID){
    console.log(enter)
}

export async function getActiveRaffles(){
    const raffles = await window.raffleContract.active_raffles()
    return raffles
}

export async function getNFTs(network){
    const account = window.walletConnection.account()
    const response = await window.fetch(`https://helper.${network}.near.org/account/${account.accountId}/likelyNFTs`, {method: 'GET', body: undefined, headers: {'Content-type':'application/json; charset=utf-8'}})
    const contracts = await response.json()
    let result = []
    for(let i in contracts){
        const contract = await new Contract(account, contracts[i], {
            viewMethods: ['nft_tokens_for_owner']
        })
        const nfts = await contract.nft_tokens_for_owner({account_id: account.accountId})
        result.push(...nfts.map((elem) => {
            return {"contract": contracts[i], "data": elem}
        }))
    }
    return result
}

export async function getNFT(contract, token_id){
    const account = window.walletConnection.account()
    const contractObj = await new Contract(account, contract, {
        viewMethods: ['nft_token']
    })
    const nft = await contractObj.nft_token({token_id: token_id})
    return nft
}

export function goTo(link){
    window.location.assign(link)
}