import { verify } from "jsonwebtoken";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { Context } from "../context/Context";

export const isAuth: Middleware<Context> = ({ context }, next) => {
  console.log(context.req.cookies.qid);

  if (context.req.cookies.qid) {
    try {
      console.log("context.req.cookies.qid");
      console.log(context.req.cookies.qid);
      const token = context.req.cookies.qid;

      const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);

      context.payload = payload as any;
    } catch (err) {
      console.log(err);

      throw new Error("not authorized");
    }

    return next();
  }
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not Authorized");
  }

  try {
    const token = authorization.split(" ")[1];

    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    context.payload = payload as any;
  } catch (err) {
    console.log(err);

    throw new Error("not authorized");
  }

  return next();
};
