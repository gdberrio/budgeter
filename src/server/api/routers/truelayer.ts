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
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const params = {
        grant_type: "authorization_code",
        client_id: env.TRUELAYER_CLIENT_ID,
        client_secret: env.TRUELAYER_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/callback",
        code: input.code,
      };
      try {
        const connect_URL = `${env.TRUELAYER_AUTH_API}/connect/token`;
        const auth_request = await fetch(connect_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const auth_response =
          (await auth_request.json()) as exchangeCodeResponse;
        console.log(auth_response);
        if (!session || !session.user) {
          throw new Error("No user session");
        }
        const token = await prisma.bank.create({
          data: {
            access_token: auth_response.access_token,
            expires_in: auth_response.expires_in,
            token_type: auth_response.token_type,
            refresh_token: auth_response.refresh_token,
            scope: auth_response.scope,
            userId: session?.user.id,
          },
        });
        return { auth_response };
      } catch (error) {
        console.log(error);
      }
    }),
});
