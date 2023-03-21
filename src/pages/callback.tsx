import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

interface exchangeCodeResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

const Callback: React.FC = () => {
  const router = useRouter();

  const authCode = router.query.code ? (router.query?.code as string) : null;
  const [response, setResponse] = useState<exchangeCodeResponse | null>(null);
  const refresh_token = api.truelayer.exchangeCode.useMutation();

  useEffect(() => {
    if (authCode && response === null) {
      refresh_token
        .mutateAsync({ code: authCode })
        .then((res) => {
          if (res) {
            setResponse(res.auth_response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [authCode]);

  return (
    <>
      <h1>Callback</h1>
      <p>authCode: {authCode}</p>
      <p>response: {response?.access_token}</p>
    </>
  );
};

export default Callback;
