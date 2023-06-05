import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gitea_id: number;

    @Column()
    name: string;

    @Column()
    owner_id: string;

    @Column()
    owner_name: string;
}
