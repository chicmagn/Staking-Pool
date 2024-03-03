import {Container, Heading, Flex, SimpleGrid} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import StakeToken from "./components/StakeToken";
import RewardToken from "./components/RewardToken";
import StakeWidget from "./components/StakeWidget";
import detectEthereumProvider from '@metamask/detect-provider'
import { useState, useEffect } from "react";
import { useSDK } from '@metamask/sdk-react';
export default function Home() {

  const [account, setAccount] = useState();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  return (
    <Container maxW={"1200px"} py={4}>
      <Navbar></Navbar>
      {!connected?
        (
          <></>
        ) :
        (<>
          
          <div>
            <>
              {chainId && `Connected chain: ${chainId}`}
              <p></p>
              {account && `Connected account: ${account}`}
            </>
          </div>
          
          <SimpleGrid columns={1} spacing={4}>
            {/* <StakeToken></StakeToken> */}
            <RewardToken></RewardToken>
          </SimpleGrid>
          <StakeWidget></StakeWidget>
        </>)
      }
    </Container>
  );
}
