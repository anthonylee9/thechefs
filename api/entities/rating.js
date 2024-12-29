import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterInsert } from 'typeorm';
import { Recipe } from './recipe'
import { User } from './user'

@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id

    @Column({type: 'integer', nullable: false})
    score

    @Column({type: 'varchar', nullable: false})
    description

    @Column({type: 'varchar', nullable: false})
    associatedRecipeTitle

    @ManyToOne(() => User, (user) => user.ratings)
    user

    @ManyToOne(() => Recipe, (recipe) => recipe.ratings)
    recipe

}