import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
  const [entranceFee, setEntranceFee] = useState("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()
  //   const web3 = useWeb3()

  // get chainId obj from Moralis and re-name it
  const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null

  // get contract instance
  //   const contract = new ethers.Contract(raffleAddress, abi, web3)

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  })

  async function updateUI() {
    // try to read the raffle fee
    // can't call await inside useEffect
    // so use a async func
    const fee = (await getEntranceFee()).toString()
    const getNumOfPlayersFromCall = (await getNumberOfPlayers()).toString()
    const getWinnerFromCall = (await getRecentWinner()).toString()
    setEntranceFee(fee)
    setNumberOfPlayers(getNumOfPlayersFromCall)
    setRecentWinner(getWinnerFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
      // listenForWinnerToBePicked()
    }
  }, [isWeb3Enabled])

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNewNotification(tx)
    updateUI()
  }

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      title: "Transaction Notification",
      message: "Transaction Complete!",
      position: "topR",
    })
  }

  return (
    <div className="p-5">
      {raffleAddress ? (
        <div>
          <div className="mt-3 font-medium">{`Entrance fee is: ${ethers.utils.formatUnits(
            entranceFee,
            "ether"
          )} ETH`}</div>
          <div className="mt-3 font-medium">{`Number of players: ${numberOfPlayers}`}</div>
          <div className="mt-3 font-medium">{`Recent Winner: ${recentWinner}`}</div>
          <button
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border border-b-2 h-8 w-8 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
      {/* <div>This site is hosted on IPFS</div> */}
    </div>
  )
}
export default LotteryEntrance
