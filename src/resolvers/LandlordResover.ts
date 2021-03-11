import { Context } from "./../context/Context";
import { Landlord } from "../entity/Landlord";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuthMiddleware";
@ObjectType()
class LandlordResponse {
  @Field()
  status: String;
  @Field()
  code: String;
}

@Resolver()
export class LandlordResolver {
  // @Query(() => String)
  // hello() {
  //   return "hi";
  // }
  // @Query(() => String)
  // @UseMiddleware(isAuth)
  // bye(@Ctx() { payload }: Context) {
  //   return `your id is ${payload!.userId}`;
  // }

  @Query(() => [Landlord])
  @UseMiddleware(isAuth)
  landlords() {
    return Landlord.find();
  }

  @Mutation(() => LandlordResponse)
  @UseMiddleware(isAuth)
  async createLandlord(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("phoneNumber") phoneNumber: string,
    @Ctx() { payload }: Context
  ) {
    // const hasPassword = await hash(password, 12);
    try {
      await Landlord.insert({
        firstName,
        lastName,
        phoneNumber,
        userId: Number(payload!.userId),
      });
    } catch (error) {
      console.log(error);
      return { status: "error", code: 500 };
    }

    return { status: "done", code: 200 };
  }

  @Mutation(() => LandlordResponse)
  @UseMiddleware(isAuth)
  async updateLandlord(
    @Ctx() { payload }: Context,
    @Arg("firstName", { nullable: true }) firstName: string,
    @Arg("lastName", { nullable: true }) lastName: string,
    @Arg("phoneNumber", { nullable: true }) phoneNumber: string
  ) {
    const landlord = await Landlord.findOne({
      where: { userId: payload!.userId },
    });

    // const hasPassword = await hash(password, 12);
    try {
      await Landlord.update(
        { id: landlord!.id },
        {
          firstName: firstName || landlord!.firstName,
          lastName: lastName || landlord!.lastName,
          phoneNumber: phoneNumber || landlord!.phoneNumber,
        }
      );

      // await Landlord.insert({
      //   firstName,
      //   lastName,
      //   phoneNumber,
      //   userId: Number(payload!.userId),
      // });
    } catch (error) {
      console.log(error);
      return { status: "error", code: 500 };
    }

    return { status: "updated", code: 200 };
  }
}
