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
import { Context } from "../context/Context";
import { Property } from "../entity/Property";
import { isAuth } from "../middleware/isAuthMiddleware";
@ObjectType()
class PropertyResponse {
  @Field()
  status: String;
  @Field()
  code: String;
}

@Resolver()
export class PropertyResolver {
  @Query(() => [Property])
  @UseMiddleware(isAuth)
  properties() {
    return Property.find();
  }

  @Mutation(() => PropertyResponse)
  @UseMiddleware(isAuth)
  async createProperty(
    @Arg("name") name: string,
    @Arg("location") location: string,
    @Arg("description") description: string,
    @Ctx() { payload }: Context
  ) {
    // const user = await User.findOne({ where: { id: payload?.userId } });
    // const hasPassword = await hash(password, 12);

    const landlord = await Landlord.findOne({
      where: { userId: payload!.userId },
    });

    try {
      // await Landlord.update({id: landlord?.id}, {properties : properties})
      await Property.insert({
        name,
        description,
        location,
        landlordId: landlord!.id,
      });
    } catch (error) {
      console.log(error);
      return { status: "error", code: 500 };
    }

    return { status: "done", code: 200 };
  }
}
