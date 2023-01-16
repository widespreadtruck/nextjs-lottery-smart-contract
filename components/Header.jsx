import { ConnectButton } from "web3uikit"

const Header = () => {
  return (
    <div className="p-5 border-b-2 flex flex-row text-gray-300">
      <div className="py-4 px-4 font-blog text-3xl font-monospace">
        Decentralized Lottery 🍀
      </div>
      <div className="ml-auto py-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  )
}

export default Header
