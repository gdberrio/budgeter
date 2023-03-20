import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Personal Finance Dashboard</h1>
      <p>Track your finances and see how you are doing.</p>

      <div>
        {session ? (
          <>
            <div>
              <p>Signed in as {session.user?.name} </p>
              <button
                onClick={() => {
                  signOut().catch(console.log);
                }}
              >
                Sign out
              </button>
              <br/>
              <a href="https://auth.truelayer.com/?response_type=code&client_id=364512-83024d&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=http://localhost:3000/callback&providers=uk-ob-all%20uk-oauth-all">
                Link Bank Account
              </a>
            </div>
          </>
        ) : (
          <>
            <p>Not signed in</p>
            <button
              onClick={() => {
                signIn("google").catch(console.log);
              }}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
