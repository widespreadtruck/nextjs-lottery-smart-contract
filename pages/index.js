import Head from "next/head"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

import Particles from "react-particles"
import { loadFull } from "tsparticles"
import { particlesConfig } from "../constants"
import { useCallback } from "react"

export default function Home() {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine)
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container)
  }, [])

  return (
    <div>
      <Head>
        <title>Lottery Smart Contract</title>
        <meta name="description" content="Smart contract lottery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Connect nav bar */}
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
      <div className="-z-50 absolute">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesConfig}
        />
      </div>
    </div>
  )
}
