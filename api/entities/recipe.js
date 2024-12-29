import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, AfterUpdate, AfterInsert, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Rating } from './rating';
import { Tag } from './tag';

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id

    @Column({type: 'varchar', nullable: false})
    title

    @Column({type: 'varchar', nullable: false})
    description

    @Column({type: 'varchar', nullable: false})
    videoLink

    @Column({type: 'varchar', nullable: false})
    fileName

    @ManyToOne(() => User, (user) => user.recipes)
    user

    @OneToMany(() => Rating, (rating) => rating.recipe) 
    ratings

    @ManyToMany(() => Tag)
    @JoinTable()
    tags

}