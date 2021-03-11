import { Field, ObjectType, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("property")
export class Property extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column("text")
  name: string;

  @Column("text")
  location: string;

  @Column("text")
  description: string;
}
