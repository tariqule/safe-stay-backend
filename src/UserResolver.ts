import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { createAccessToken, createRefreshToken } from "./auth";
import { Context } from "./Context";
import { User } from "./entity/User";
import { isAuth } from "./isAuthMiddleware";
import { sendRefreshToken } from "./sendRefreshToken";
@ObjectType()
class LoginResponse {
  @Field()
  accessToken: String;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: Context) {
    return `your id is ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error("could not find the user ");
    }

    // res.cookie("qid", createRefreshToken(user), {
    //   httpOnly: true,
    // });
    sendRefreshToken(res, createRefreshToken(user));

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }
    //login suceess

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hasPassword = await hash(password, 12);
    try {
      await User.insert({
        email: email,
        password: hasPassword,
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }
}
