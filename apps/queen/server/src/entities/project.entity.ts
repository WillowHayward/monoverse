import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ProjectEntity {
    @PrimaryColumn()
    id: number; // Gitea id

    @Column()
    name: string;

    @Column()
    owner_id: number;

    @Column()
    owner_name: string;
}
