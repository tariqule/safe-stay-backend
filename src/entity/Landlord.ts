import { Field, ObjectType, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("landlord")
export class Landlord extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  phoneNumber: string;
}
