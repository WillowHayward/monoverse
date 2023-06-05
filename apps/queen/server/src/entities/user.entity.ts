import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // TODO: See if this can be consolidated with above
    @Column()
    gitea_id: number;

    @Column()
    name: string;
}
