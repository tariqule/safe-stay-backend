import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("property")
export class Property extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column("text")
  location: string;

  @Field()
  @Column("text")
  description: string;

  @Field()
  @Column({ nullable: true })
  landlordId: number;
}
