import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterInsert, Index } from 'typeorm';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id

    @Column({type: 'varchar', nullable: false})
    @Index({ unique: true })
    text
}