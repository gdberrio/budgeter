import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";

interface exchangeCodeResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token: string;
    scope: string;
}

export const truelayerRouter = createTRPCRouter({
  exchangeCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const params = new URLSearchParams();
      params.set("grant_type", "authorization_code");
      params.set("client_id", env.TRUELAYER_CLIENT_ID);
      params.set("client_secret", env.TRUELAYER_CLIENT_SECRET);
      params.set("redirect_uri", "http://localhost:3000/api/callback");
      params.set("code", input.code);
      const connect_URL = `${env.TRUELAYER_AUTH_API}/connect/token?${params.toString()}`;
      const auth_request = await fetch(connect_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        const auth_response = await auth_request.json() as exchangeCodeResponse;
        console.log(auth_response);
        return auth_response;
    }),
});
