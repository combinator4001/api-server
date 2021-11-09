import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/app/prisma.service';

type resultUser = {
    id : number,
    username : string,
    role : Role
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    /**
     * Find a user and removes password from object
     * @param username 
     * @param pass 
     * @returns 
     */
    async findUser(username: string, pass: string) : Promise<resultUser> {
        const user = await this.prisma.user.findUnique({
            where : {
              username : username
            }
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    /**
     * Signs a token to the user
     * @param user 
     * @returns 
     */
    async signToken(user: resultUser) {
        const payload = { 
            id: user.id,
            username: user.username, 
            role : user.role
        };
        return {
          access_token: await this.jwtService.sign(payload),
        };
    }
}
