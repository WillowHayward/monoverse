import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { AuthTokenResponse } from '../types/auth';
import * as Gitea from '../types/gitea';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async createUser(giteaUser: Gitea.User, authResponse: AuthTokenResponse): Promise<User | null> {
        if (await this.findUser(giteaUser)) {
            console.error('User Already Exists');
            return null;
        }

        const now = (new Date()).valueOf();
        const tokenExpiry = now + authResponse.expires_in * 1000;

        const user = this.usersRepository.create({
            gitea_id: giteaUser.id,
            name: giteaUser.full_name,
            oauth_access_token: authResponse.access_token,
            oauth_token_expires: tokenExpiry,
            oauth_refresh_token: authResponse.refresh_token,
        });
        this.usersRepository.insert(user);

        console.log('Created user', user.name);
        return user;
    }

    async findUser(user: Gitea.User): Promise<User | null> {
        return this.findUserById(user.id);
    }

    async findUserById(id: number): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ gitea_id: id })
        if (!user) {
            return null;
        }

        console.log('Found user', user.name);

        return user;

    }
}
