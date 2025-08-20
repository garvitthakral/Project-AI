import React, { createContext, useContext, useEffect } from "react";
import socketApi from "../API/SocketApi"; 

const SocketContext = createContext(socketApi);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    const onConnect = () => console.log("✅ Connected:", socketApi.id);
    const onDisconnect = () => console.log("🔌 Disconnected");

    socketApi.on("connect", onConnect);
    socketApi.on("disconnect", onDisconnect);

    return () => {
      socketApi.off("connect", onConnect);
      socketApi.off("disconnect", onDisconnect);
      // don’t disconnect here if this wraps the whole app
    };
  }, []);

  return (
    <SocketContext.Provider value={socketApi}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
