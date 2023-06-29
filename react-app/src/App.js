import { useState, useEffect } from "react";
import { ethers } from "ethers";

import Login from "./components/Login";

import "./App.css";

import { contractAbi, contractAddress } from "./constant";
import Connected from "./components/Connected";

function App() {
  const [number, setNumber] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [remainingtime, setRemainingTime] = useState(null);
  const [votingStatus, setVotingStatus] = useState(true);

  const [provider, setProvider] = useState(null);

  const [account, setAccount] = useState(null);

  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const candidatesList = await contractInstance.getAllVotesOfCandiates();

    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      };
    });

    setCandidates(formattedCandidates);

    console.log(formattedCandidates);
  }

  async function getCurrentStatus(accounts) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    setProvider(provider);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const status = await contractInstance.getVotingStatus();
    console.log(status);

    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    setProvider(provider);

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const time = await contractInstance.getRemainingTime();

    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        setProvider(provider);

        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();

        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask connected", address);

        setIsConnected(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Metamask not connected");
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {isConnected ? (
        <Connected
          candidates={candidates}
          remainingtime={remainingtime}
          handleNumberChange={handleNumberChange}
          account={account}
        />
      ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  );
}

export default App;
