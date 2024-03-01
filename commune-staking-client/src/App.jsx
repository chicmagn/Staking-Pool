import { ConnectWallet } from "@thirdweb-dev/react";
import {Container, Heading, Flex, SimpleGrid} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import Navbar from "./components/Navbar";
import StakeToken from "./components/StakeToken";
import RewardToken from "./components/RewardToken";
import StakeWidget from "./components/StakeWidget";

export default function Home() {
  const address = useAddress();

  return (
    <Container maxW={"1200px"} py={4}>
      <Navbar></Navbar>
      {address?
        (
          <Container maxW={"1200px"} py={4}>
            <Flex h={"50vh"} justifyContent={"center"}>
                <Heading>Please connect your wallet</Heading>
            </Flex>
          </Container>
        ) :
        (<>
          <SimpleGrid columns={2} spacing={4}>
            <StakeToken></StakeToken>
            <RewardToken></RewardToken>
          </SimpleGrid>
          <StakeWidget></StakeWidget>
        </>)
      }
    </Container>
    
  );
}
