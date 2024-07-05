"use client"
import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { FlipperWallet } from "@flipperplatform/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { OpenBlockWallet } from "@openblockhq/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { OnekeyWallet } from "@onekeyfe/aptos-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { ReactNode } from "react";

export default function AptosWalletProvider({ children }) {
  const wallets = [
    new BitgetWallet(),
    new FewchaWallet(),
    new FlipperWallet(),
    new MartianWallet(),
    // new MSafeWalletAdapter(),
    new OpenBlockWallet(),
    new PetraWallet(),
    new PontemWallet(),
    new RiseWallet(),
    new TokenPocketWallet(),
    new TrustWallet(),
    new WelldoneWallet(),
    new OKXWallet(),
    new OnekeyWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      dappConfig={{ network: Network.MAINNET, aptosConnectDappId: 'a1103774-1419-4148-b911-a6cc74069609' }}
      autoConnect={true}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}