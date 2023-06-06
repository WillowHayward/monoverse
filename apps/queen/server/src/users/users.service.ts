import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import * as Gitea from '../types/gitea';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async createUser(giteaUser: Gitea.User): Promise<UserEntity | null> {
        if (await this.findUser(giteaUser)) {
            console.error('User Already Exists');
            return null;
        }

        const user = this.usersRepository.create({
            id: giteaUser.id,
            name: giteaUser.full_name,
            username: giteaUser.login,
        });
        this.usersRepository.insert(user);

        console.log('Created user', user.name);
        return user;
    }

    async findUser(user: Gitea.User): Promise<UserEntity | null> {
        return this.findUserById(user.id);
    }

    async findUserById(id: number): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) {
            return null;
        }

        console.log('Found user', user.name);

        return user;

    }
}
