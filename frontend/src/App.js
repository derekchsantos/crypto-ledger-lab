import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LedgerMessage from "./contracts/LedgerMessage.json";
import FsocietyToken from "./contracts/FsocietyToken.json";

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [isHacking, setIsHacking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mantenha seus endereços atualizados aqui
  const tokenAddress = "0x4AbC345eE3425C9F5A70024F4eC6e335EC79Ed17"; 
  const ledgerAddress = "0x2aD5f1687FFceD4DabA7fa580088680F331e6c41";

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 7));
  };

  // MONITORAMENTO AUTOMÁTICO (Auto-refresh a cada 5 segundos)
  useEffect(() => {
    let interval;
    if (account) {
      interval = setInterval(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        loadData(provider, account);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [account]);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        addLog("SYSTEM_CONNECTED: Acesso garantido.");
        loadData(provider, accounts[0]);
      } catch (err) {
        addLog("ERROR: Falha ao conectar carteira.");
      }
    } else {
      alert("Instale a MetaMask!");
    }
  }

  async function loadData(provider, userAddress) {
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, FsocietyToken.abi, signer);
      const ledgerContract = new ethers.Contract(ledgerAddress, LedgerMessage.abi, signer);

      const userBalance = await tokenContract.balanceOf(userAddress);
      const currentMsg = await ledgerContract.message();

      const formattedBal = ethers.formatEther(userBalance);
      
      // Se a mensagem mudar, dispara o efeito visual
      if (currentMsg !== message && message !== "") {
        setIsHacking(true);
        addLog(`SIGNAL_DETECTED: Nova mensagem na rede.`);
        setTimeout(() => setIsHacking(false), 1000);
      }

      setBalance(formattedBal);
      setMessage(currentMsg);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  }

  async function updateLedger() {
    if (!newMessage) return;
    setLoading(true);
    addLog("SENDING_PAYLOAD: Aguardando assinatura...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const ledgerContract = new ethers.Contract(ledgerAddress, LedgerMessage.abi, signer);

      const tx = await ledgerContract.updateMessage(newMessage, { gasLimit: 100000 });
      addLog(`TX_PENDING: ${tx.hash.substring(0, 15)}...`);
      
      await tx.wait();
      addLog("HACK_SUCCESS: Bloco minerado.");
      setNewMessage("");
      loadData(provider, account);
    } catch (err) {
      addLog("ERROR: Transação abortada.");
    }
    setLoading(false);
  }

  return (
    <div style={{ 
      backgroundColor: "#000", 
      color: isHacking ? "#fff" : "#ff0000", 
      minHeight: "100vh", 
      padding: "50px", 
      fontFamily: "monospace",
      transition: "background-color 0.3s"
    }}>
      <h1 style={{ letterSpacing: "2px" }}>{">"} FSOCIETY_BLOCKCHAIN_MONITOR</h1>
      
      {!account ? (
        <button onClick={connectWallet} style={buttonStyle}>INITIALIZE_SYSTEM</button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ border: "1px solid #ff0000", padding: "20px", backgroundColor: "#050505" }}>
            <p style={{ margin: "5px 0" }}>USER_ID: <span style={{color: "#888"}}>{account}</span></p>
            <p style={{ margin: "5px 0" }}>ASSETS: <span style={{color: "#fff"}}>{balance} FSC</span></p>
            <p style={{ margin: "5px 0" }}>CORE_MSG: <span style={{ color: "#fff", textTransform: "uppercase" }}>"{message}"</span></p>
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 2, border: "1px solid #333", padding: "20px" }}>
              <h3>{">"} INJECT_DATA</h3>
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Aguardando comando..." 
                style={inputStyle} 
              />
              <button onClick={updateLedger} disabled={loading} style={buttonStyle}>
                {loading ? "PROCESSING..." : "EXECUTE"}
              </button>
            </div>

            <div style={{ flex: 1, backgroundColor: "#0a0a0a", padding: "15px", borderLeft: "3px solid #ff0000" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "14px", borderBottom: "1px solid #333" }}>ENCRYPTED_LOGS</h3>
              {logs.map((log, i) => (
                <p key={i} style={{ fontSize: "11px", margin: "5px 0", color: i === 0 ? "#00ff00" : "#666" }}>{log}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { backgroundColor: "#000", color: "#ff0000", border: "1px solid #ff0000", padding: "12px", width: "60%", outline: "none" };
const buttonStyle = { backgroundColor: "#ff0000", color: "#000", border: "none", padding: "12px 25px", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase" };

export default App;
