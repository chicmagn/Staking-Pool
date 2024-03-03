import { Card, Heading, Skeleton, Stack, Text} from "@chakra-ui/react";
import { COMMUNE_STAKING_CONTRACT_ADDRESS } from "../constants/addresses";
import { ethers} from "ethers";
import ComStakingJson from '../../../artifacts/contracts/ComStaking.sol/ComStaking.json';
import { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";

export default function RewardToken() {
    const { sdk, connected, connecting, provider, chainId, account } = useSDK();
    const [rewardTokenBalance, setRewardTokenBalance] = useState("0");
    useEffect(()=> {
        getRewardTokenBalance();
    }, []);

    const getRewardTokenBalance = async() => {
        try {
            if (window.ethereum){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                // console.log(signer)
                const ComStakingContract = new ethers.Contract(COMMUNE_STAKING_CONTRACT_ADDRESS, ComStakingJson.abi, signer);
                await ComStakingContract.getRewardTokenBalance().then(data=> {
                    setRewardTokenBalance(data.toString());
                })
            } else {
                console.log("Ethereum Object doesn't exist")
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Card p={5}>
            <Stack>
                <Heading>
                    Reward Token
                </Heading>
                <Skeleton h={4} w={"50%"} isLoaded={true}>
                    <Text fontSize={"large"} fontWeight={"bold"}>${'comaiRT'}</Text>
                </Skeleton>
                <Skeleton h={4} w={"50%"} isLoaded={true}>
                    <Text>{rewardTokenBalance}</Text>
                </Skeleton> 
            </Stack>
        </Card>
    )
}