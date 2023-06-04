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

    @Column()
    oauth_access_token: string;

    @Column()
    oauth_token_expires: number;

    @Column()
    oauth_refresh_token: string;
}
