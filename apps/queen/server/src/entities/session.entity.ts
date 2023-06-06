import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    user_id: number;

    @Column({
        unique: true,
    })
    token: string;

    @Column({
        nullable: true
    })
    token_expiry: number;

    @Column({
        unique: true,
    })
    state: string;

    @Column({
        nullable: true
    })
    oauth_access_token: string;

    @Column({
        nullable: true
    })
    oauth_token_expires: number;

    @Column({
        nullable: true
    })
    oauth_refresh_token: string;
}
