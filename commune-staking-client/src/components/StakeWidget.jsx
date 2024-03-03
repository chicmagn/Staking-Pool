import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { COMMUNE_STAKING_CONTRACT_ADDRESS } from "../constants/addresses";
import { Box, Button, Card, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";
import ComStakingJson from '../../../artifacts/contracts/ComStaking.sol/ComStaking.json';
import { useSDK } from "@metamask/sdk-react";
export default function StakeWidget() {
    const { sdk, connected, connecting, provider, chainId, account } = useSDK();
    const [stakeInfo, setStakeInfo] = useState();
    useEffect(()=>{
        
    }, []);

    const getStakeInfo = async () => {
        try {
            if (window.ethereum){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const ComStakingContract = new ethers.Contract(COMMUNE_STAKING_CONTRACT_ADDRESS, ComStakingJson.abi, signer);
                await ComStakingContract.getStakeInfo(account).then(data=> {
                    setStakeInfo(data);
                })
            } else {
                console.log("Ethereum Object doesn't exist")
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(()=> {
        setInterval(() => {
            getStakeInfo();
        }, 5000);
    }, []);

    const [stakeAmount, setStakeAmount] = useState("0");
    const [unstakeAmount, setUnstakeAmount] = useState("0");

    function resetValue(){
        setStakeAmount("0");
        setUnstakeAmount("0");
    }

    const stake = async() => {
        try {
            if (window.ethereum){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const ComStakingContract = new ethers.Contract(COMMUNE_STAKING_CONTRACT_ADDRESS, ComStakingJson.abi, signer);
                await ComStakingContract.stake(stakeAmount).then(data=> {
                    resetValue();
                    console.log(data);
                    ()=> toast({
                        title: "Stake Successful",
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
            } else {
                console.log("Ethereum Object doesn't exist")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const withdraw = async() => {
        try {
            if (window.ethereum){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const ComStakingContract = new ethers.Contract(COMMUNE_STAKING_CONTRACT_ADDRESS, ComStakingJson.abi, signer);
                await ComStakingContract.withdraw(unstakeAmount).then(data=> {
                    resetValue();
                    console.log(data);
                    ()=> toast({
                        title: "Unstake Successful",
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
            } else {
                console.log("Ethereum Object doesn't exist")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const claimRewards = async() => {
        try {
            if (window.ethereum){
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const ComStakingContract = new ethers.Contract(COMMUNE_STAKING_CONTRACT_ADDRESS, ComStakingJson.abi, signer);
                await ComStakingContract.claimRewards().then(data=> {
                    resetValue();
                    console.log(data);
                    ()=> toast({
                        title: "Claim Successful",
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                    });
                })
            } else {
                console.log("Ethereum Object doesn't exist")
            }
        } catch (e) {
            console.log(e)
        }
    }

    const toast = useToast();

    return (
        <Card p={5} mt={10}>
            <Heading>Earn</Heading>
            <SimpleGrid columns={2}>
                <Card p={5} m={5}>
                    <Box textAlign={"center"} mb={5}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Stake:</Text>
                        <Skeleton isLoaded={true}>
                            {stakeInfo && stakeInfo[0]? (
                                <Text>{ethers.utils.formatEther(stakeInfo[0])}{" $comaiST"}</Text>
                            ): (<Text>0</Text>)}
                            <Text></Text>
                        </Skeleton>
                    </Box>
                    <SimpleGrid columns={2} spacing={4}>
                        <Stack spacing={4}>
                            <Input type="number"
                            // max={stakeTokenBalance?.displayValue}
                            value={stakeAmount}
                            onChange={(e)=> setStakeAmount(e.target.value)}></Input>
                            <Button
                                onClick={stake}>
                                Stake
                            </Button>
                        </Stack>
                        <Stack spacing={4}>
                            <Input type="number"
                            value={unstakeAmount}
                            onChange={(e)=> setUnstakeAmount(e.target.value)}></Input>
                            <Button
                                onClick={withdraw}>
                                Unstake
                            </Button>
                        </Stack>
                    </SimpleGrid>
                </Card>
                <Card p={5} m={5}>
                    <Flex h={"100%"} justifyContent={"space-between"} direction={"column"} >
                        <Text fontSize={"xl"} fontWeight={"bold"}>Reward token: </Text>
                        <Skeleton isLoaded={true}>
                            {stakeInfo && stakeInfo[0] ? (
                                <Box>
                                    <Text fontSize={"xl"} fontWeight={"bold"}>{ethers.utils.formatEther(stakeInfo[1])}</Text>
                                    <Text>{" $comaiRT"}</Text>
                                </Box>
                            ):(
                                <Text>0</Text>
                            )}
                        </Skeleton>
                        <Button onClick={claimRewards}>Claim</Button>
                    </Flex>
                </Card>
            </SimpleGrid>
        </Card>
    )
}