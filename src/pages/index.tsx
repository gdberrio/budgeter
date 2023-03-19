import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
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
            <p>Signed in as {session.user?.name} </p>
            <button
              onClick={() => {
                signOut().catch(console.log);
              }}
            >
              Sign out
            </button>
            
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
