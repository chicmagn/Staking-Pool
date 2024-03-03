import {Container, Flex, Heading} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
export default function Navbar() {
    const [hasProvider, setHasProvider] = useState(null);
    const initialState = { accounts: [] } 
    const [wallet, setWallet] = useState(initialState) ;
    useEffect(() => {
      const getProvider = async () => {
        const provider = await detectEthereumProvider({ silent: true })
        setHasProvider(Boolean(provider))
      }
      getProvider()
    }, []);
    const handleConnect = async () => {  
      let accounts = await window.ethereum.request({  method: "eth_requestAccounts" })  
      updateWallet(accounts)   
    } 
    const updateWallet = async (accounts) => {
      setWallet({ accounts })
    } 
    return (
        <Container maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"}>
                <Heading>Commune Staking App</Heading>
                { wallet.accounts.length > 0 ? 
                  (<div>Wallet Accounts: { wallet.accounts[0] }</div>) : 
                  (hasProvider) && 
                  (<button onClick={handleConnect}>Connect MetaMask</button>)
                }
            </Flex>
        </Container>
    )
}