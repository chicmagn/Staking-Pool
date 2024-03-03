import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Web3Provider } from "@ethersproject/providers";
import { ChakraProvider } from "@chakra-ui/react";
import { MetaMaskProvider } from '@metamask/sdk-react';
const activeChain = "mumbai";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <MetaMaskProvider debug={false} sdkOptions={{
      dappMetadata: {
        name: "Commune Staking App",
        url: window.location.host,
      }
    }}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
      </MetaMaskProvider>
  </React.StrictMode>
);
