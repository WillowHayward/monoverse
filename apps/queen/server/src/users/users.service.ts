import { Injectable } from '@nestjs/common';

// TODO: make this an actual db
interface User {
    gitea_id: number;
    name: string;
}
type UserDB = User[]

@Injectable()
export class UsersService {
    private userDB: UserDB = [];

    createUser(id: number, name: string): User | false {
        if (this.findUser(id)) {
            console.error('User Already Exists');
            return false;
        }

        const user: User = {
            gitea_id: id,
            name
        }
        this.userDB.push(user);
        console.log('Created user for', user.name);
        return user;
    }

    findUser(id: number): User | false {
        const user = this.userDB.find(user => user.gitea_id === id);
        if (!user) {
            return false;
        }

        return user;
    }

}
