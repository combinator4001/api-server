import { Role } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/app/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    /**
     * Finds an user object and removes password from that.
     * @param username 
     * @param pass 
     * @returns 
     */
    async findUser(username: string, pass: string){
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
     * Creates a token for the given user.
     * @param user 
     * @returns 
     */
    async createToken(id : number, username : string, role : Role) {
        const payload = {
            id,
            username, 
            role
        };
        return await this.jwtService.sign(payload);
    }
}
