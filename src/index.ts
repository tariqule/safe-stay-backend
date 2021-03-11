import { PropertyResolver } from "./resolvers/PropertyResover";
import "dotenv/config";
import { createConnection } from "typeorm";
import express from "express";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/UserResolver";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./refresher/sendRefreshToken";
import cors from "cors";
import { LandlordResolver } from "./resolvers/LandlordResover";
(async () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.get("/", (_req, res) => res.send("hello"));

  app.use(cookieParser());
  app.post("/refresh_token", async (req, res) => {
    console.log(req.cookies);
    const token = req.cookies.qid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    } catch (error) {
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  console.log(process.env.ACCESS_TOKEN_SECRET);
  await createConnection();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, LandlordResolver, PropertyResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT || 4000, () => {
    console.log("Express App is running...");
  });
})();
