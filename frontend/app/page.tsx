import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";
import LoadingIndicator from "@/components/LoadingIndicator"; // 确保路径正确
import Link from "next/link";

// import { Dapp } from "@/components/crypto/Dapp";
import dynamic from "next/dynamic";
const Dapp = dynamic(() => import("@/components/crypto/Dapp"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          {/* <Link href="/market">View Task List</Link> */}
          {/* {isSupabaseConnected && <AuthButton />} */}
        </div>
      </nav>
      <Dapp />
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://github.com/14790897/ldo_coin"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            LinuxDo Coin
          </a>
          <a
            href="https://github.com/14790897/ldo_coin"
            target="_blank"
            className="font-bold text-blue-600 hover:underline hover:text-blue-800"
            rel="noreferrer"
          >
            give me a star in GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
