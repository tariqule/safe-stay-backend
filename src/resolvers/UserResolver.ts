import { compare, hash } from "bcryptjs";
import { Property } from "../entity/Property";
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
import { createAccessToken, createRefreshToken } from "../auth";
import { Context } from "../context/Context";
import { Landlord } from "../entity/Landlord";
import { User } from "../entity/User";
import { isAuth } from "../middleware/isAuthMiddleware";
import { sendRefreshToken } from "../refresher/sendRefreshToken";
@ObjectType()
class LoginResponse {
  @Field()
  accessToken: String;
}
@ObjectType()
class UserResponse {
  @Field()
  user: User;
  @Field()
  landlord: Landlord;
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
  @UseMiddleware(isAuth)
  users() {
    return User.find();
  }
  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async currentUser(@Ctx() { payload }: Context) {
    const user = await User.findOne({ where: { id: payload!.userId } });
    const landlord = await Landlord.findOne({
      where: { userId: payload!.userId },
    });

    return { user, landlord };
  }
  @Query(() => [Property])
  @UseMiddleware(isAuth)
  async getProperties(@Ctx() { payload }: Context) {
    // const user = await User.findOne({ where: { id: payload!.userId } });
    const landlord = await Landlord.findOne({
      where: { userId: Number(payload!.userId) },
    });
    try {
      const properties = await Property.find({
        where: { landlordId: landlord!.id },
      });

      return properties;
    } catch (err) {
      throw new Error("No Property Found For Current User!");
    }
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
