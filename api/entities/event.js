import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id

    @Column({ type: 'varchar', nullable: false })
    title

    @Column({ type: 'varchar', nullable: false })
    location

    @Column({ type: 'varchar', nullable: false })
    description

    @Column({ type: 'varchar', nullable: false })
    zipCode

    @ManyToOne(() => User, (user) => user.events)
    user
}