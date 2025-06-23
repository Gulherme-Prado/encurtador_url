import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn,UpdateDateColumn } from "typeorm";
import { User } from "src/users/users.entity";

@Entity()
export class Url {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 6 })
    shortCode: string;

    @Column()
    originalUrl: string;

    @ManyToOne(()=> User, {nullable: true})
    user: User;

    @Column({ default: 0})
    clicks: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({type: 'timestamp', nullable: true})
    deletedAt: Date | null;

}