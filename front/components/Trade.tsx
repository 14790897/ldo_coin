import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ConnectWallet } from "./ConnectWallet";
import { SelectTradePair } from "./SelectTradePair";
import { InputAmount } from "./InputAmount";
import { ConfirmTrade } from "./ConfirmTrade";
import { Button, Text } from "@vercel/examples-ui";
import { useChain, useMoralis } from "react-moralis";

enum TradeState {
  Connect,
  SelectPair,
  InputAmount,
  ConfirmTrade,
  Loading,
}

export const TradeCrypto: React.VFC = () => {
  const router = useRouter();
  const [state, setState] = useState<TradeState>(TradeState.Connect);

  const { account, isAuthenticated, enableWeb3 } = useMoralis();

  const [isLoading, setLoading] = useState(false);
  const [tradePair, setTradePair] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!account && isAuthenticated) enableWeb3();
    if (!account || !isAuthenticated) {
      setState(TradeState.Connect);
    } else {
      setState(TradeState.SelectPair);
    }
  }, [account, enableWeb3, isAuthenticated]);

  const handleTrade = async () => {
    try {
      setLoading(true);
      await enableWeb3();
      // 假设执行交易逻辑
      console.log(`交易对: ${tradePair}, 交易金额: ${amount}`);

      setTimeout(() => {
        setLoading(false);
        alert("交易成功!");
        // 可以在这里添加路由跳转逻辑
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle">
      {state === TradeState.Connect && <ConnectWallet />}

      {state === TradeState.SelectPair && (
        <SelectTradePair onSelect={setTradePair} />
      )}

      {state === TradeState.InputAmount && (
        <InputAmount
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      )}

      {state === TradeState.ConfirmTrade && (
        <>
          <Text variant="h2">Confirm your trade</Text>
          <Text className="mt-6">
            You are trading {amount} of {tradePair}.{" "}
            <span className="underline italic">
              This process might take up to 1 minute to complete.
            </span>
          </Text>

          <section className="flex justify-center mt-6">
            <Button
              size="lg"
              variant="black"
              onClick={handleTrade}
              disabled={!account || !tradePair || !amount || isLoading}
            >
              {isLoading ? "Trading..." : "Trade"}
            </Button>
          </section>
        </>
      )}
    </div>
  );
};
