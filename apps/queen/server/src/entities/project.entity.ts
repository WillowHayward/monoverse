import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Project {
    @PrimaryColumn()
    id: number; // Gitea id

    @Column()
    name: string;

    @Column()
    owner_id: string;

    @Column()
    owner_name: string;
}
