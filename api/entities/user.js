import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ToDo } from './todo';
import { Recipe } from './recipe';
import { Rating } from './rating';
import { Event } from './event';
import { Follower } from './follower';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id

    @Column({ type: 'varchar', unique: true })
    email

    @Column({ type: 'varchar', nullable: false })
    password


    @Column({ type: 'varchar', nullable: false })
    firstName

    @Column({ type: 'varchar', nullable: false })
    lastName

    @Column({ type: 'varchar', nullable: false })
    zipCode

    @OneToMany(() => ToDo, (todo) => todo.user)
    todos

    @OneToMany(() => Recipe, (recipe) => recipe.user) 
    recipes

    @OneToMany(() => Rating, (rating) => rating.user) 
    ratings
    
    @OneToMany(() => Event, (event) => event.user) 
    events

    @OneToMany(() => Follower, (follower) => follower.userBeingFollowed)
    followers

    @OneToMany(() => Follower, (follower) => follower.userWhoIsFollowing)
    following

    // @ManyToMany(() => User, (user) => user.following)
    // @JoinTable()
    // followers

    // @ManyToMany(() => User, (user) => user.followers, {cascade: true})
    // following
}