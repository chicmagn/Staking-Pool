import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import { COMMUNE_REWARD_TOKEN_ADDRESS, COMMUNE_STAKE_TOKEN_ADDRESS, COMMUNE_STAKING_CONTRACT_ADDRESS } from "../constants/addresses";
import { Web3Button, useAddress, useContract, useContractRead, useTokenBalance} from "@thirdweb-dev/react";
import { Box, Card, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";

export default function StakeWidget() {

    const address = useAddress();
    const {
        contract: stakeTokenContract
    } = useContract(COMMUNE_STAKE_TOKEN_ADDRESS, "token");

    const {
        contract: rewardTokenContract
    } = useContract(COMMUNE_REWARD_TOKEN_ADDRESS, "token");

    const {
        contract: stakeContract
    } = useContract(COMMUNE_STAKING_CONTRACT_ADDRESS, "custom");

    const {
        data: stakeTokenBalance,
        isLoading: loadingStakeTokenBalance
    } = useTokenBalance( stakeTokenContract, address );

    const {
        data: rewardTokenBalance,
        isLoading: loadingRewardTokenBalance
    } = useTokenBalance (rewardTokenContract, address);

    const {data: stakeInfo, refetch: refetchStakeInfo, isLoading: loadingStakeInfo} = useContractRead(stakeContract, "getStakeInfo", [address]);

    useEffect(()=> {
        setInterval(() => {
            refetchStakeInfo();
        }, 10000);
    }, []);

    const [stakeAmount, setStakeAmount] = useState("0");
    const [unstakeAmount, setUnstakeAmount] = useState("0");

    function resetValue(){
        setStakeAmount("0");
        setUnstakeAmount("0");
    }

    const toast = useToast();

    return (
        <Card p={5} mt={10}>
            <Heading>Earn</Heading>
            <SimpleGrid columns={2}>
                <Card p={5} m={5}>
                    <Box textAlign={"center"} mb={5}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Stake:</Text>
                        <Skeleton isLoaded={!loadingRewardTokenBalance && !loadingStakeTokenBalance}>
                            {stakeInfo && stakeInfo[0]? (
                                <Text>{ethers.utils.formatEther(stakeInfo[0])}{" $" + stakeTokenBalance?.symbol}</Text>
                            ): (<Text>0</Text>)}
                            <Text></Text>
                        </Skeleton>
                    </Box>
                    <SimpleGrid columns={2} spacing={4}>
                        <Stack spacing={4}>
                            <Input type="number"
                            max={stakeTokenBalance?.displayValue}
                            value={stakeAmount}
                            onChange={(e)=> setStakeAmount(e.target.value)}></Input>
                            <Web3Button
                            contractAddress={COMMUNE_STAKING_CONTRACT_ADDRESS}
                            action={async(contract)=> {
                                await stakeTokenContract?.setAllowance(COMMUNE_STAKING_CONTRACT_ADDRESS, stakeAmount);
                                await contract.call("stake", [ethers.utils.parseEther(stakeAmount)]);
                                resetValue();
                            }}
                            onSuccess={()=> toast({
                                title: "Stake Successful",
                                status: 'success',
                                duration: 5000,
                                isClosable: true
                            })}
                            >Stake</Web3Button>
                        </Stack>
                        <Stack spacing={4}>
                            <Input type="number"
                            
                            value={unstakeAmount}
                            onChange={(e)=> setUnstakeAmount(e.target.value)}></Input>
                            <Web3Button
                            contractAddress={COMMUNE_STAKING_CONTRACT_ADDRESS}
                            action={async(contract)=> {
                                await contract.call("withdraw", [ethers.utils.parseEther(unstakeAmount)]);
                                resetValue();
                            }}
                            onSuccess={()=> toast({
                                title: "Unstake Successful",
                                status: 'success',
                                duration: 5000,
                                isClosable: true
                            })}
                            >Unstake</Web3Button>
                        </Stack>
                    </SimpleGrid>
                </Card>
                <Card p={5} m={5}>
                    <Flex h={"100%"} justifyContent={"space-between"} direction={"column"} >
                        <Text fontSize={"xl"} fontWeight={"bold"}>Reward token: </Text>
                        <Skeleton isLoaded={!loadingStakeInfo && !loadingRewardTokenBalance}>
                            {stakeInfo && stakeInfo[0] ? (
                                <Box>
                                    <Text fontSize={"xl"} fontWeight={"bold"}>{ethers.utils.formatEther(stakeInfo[1])}</Text>
                                    <Text>{" $" + rewardTokenBalance?.symbol}</Text>
                                </Box>
                            ):(
                                <Text>0</Text>
                            )}
                        </Skeleton>
                        <Web3Button
                        contractAddress={COMMUNE_STAKING_CONTRACT_ADDRESS}
                        actionn={async(contract)=> {
                            await contract.call("claimRewards");
                        }}
                        onSuccess={()=> toast({
                            title: "Rewards Claimed",
                            status: 'success',
                            duration: 5000,
                            isClosable: true
                        })}
                        >Claim</Web3Button>
                    </Flex>
                </Card>
            </SimpleGrid>
        </Card>
    )
}