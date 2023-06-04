import { Injectable } from '@nestjs/common';
import * as Gitea from '../types/gitea';

// TODO: make this an actual db
interface User {
    gitea_id: number;
    name: string;
}
type UserDB = User[]

@Injectable()
export class UsersService {
    constructor() {}

    private userDB: UserDB = [];

    createUser(giteaUser: Gitea.User): User | false {
        if (this.findUser(giteaUser)) {
            console.error('User Already Exists');
            return false;
        }

        const user: User = {
            gitea_id: giteaUser.id,
            name: giteaUser.full_name
        }
        this.userDB.push(user);
        console.log('Created user for', user.name);
        return user;
    }

    findUser(user: Gitea.User): User | false {
        return this.findUserById(user.id);
    }

    findUserById(id: number): User | false {
        const user = this.userDB.find(user => user.gitea_id === id);
        if (!user) {
            return false;
        }

        return user;

    }
}
