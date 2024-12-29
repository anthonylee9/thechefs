import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Follower {
    @PrimaryGeneratedColumn()
    id

    @ManyToOne(() => User, (user) => user.followers) 
    userBeingFollowed
    
    @ManyToOne(() => User, (user) => user.following)
    userWhoIsFollowing


}