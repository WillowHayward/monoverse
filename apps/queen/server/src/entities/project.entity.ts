import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Project } from '@whc/queen/model';

@Entity()
export class ProjectEntity implements Project {
    @PrimaryColumn()
    id: number; // Gitea id

    @Column()
    name: string;

    @Column()
    owner_id: number;

    @Column()
    owner_name: string;
}
