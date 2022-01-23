import { Role, User } from '.prisma/client';
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
        const user : User = await this.prisma.user.findUnique({
            where : {
              username : username
            }
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            const {password, ...result} = user
            return result;
        }

        return null;
    }

    /**
     * Creates a token for the given user.
     * general purpose.
     * @param user 
     * @returns 
     */
    async createToken(id : number, username : string, role : Role) {
        const payload = {
            id,
            username, 
            role
        };
        return await this.jwtService.sign(payload, {expiresIn : '2h'});
    }

    /**
     * Creates a forget pass token for the given user.
     * only for forget pass
     * @param id 
     * @param username 
     * @param role 
     * @param hashedPassLastTenChars 
     * @returns 
     */
    async createForgetPassToken(id : number, username : string, role : Role, hashedPassLastTenChars : string){
        const payload = {
            id,
            username,
            role,
            hashedPassLastTenChars
        }
        return await this.jwtService.sign(payload, {expiresIn : '10m'})
    }

    async forgetTokenIsUsed(id : number, hashedPassLastTenChars : string) : Promise<boolean>{
        const user = await this.prisma.user.findUnique({
            where : {
                id : id
            }
        });
        if(user.password.slice(user.password.length - 10 , user.password.length - 1) !== hashedPassLastTenChars){
            //token is used
            return true;
        }
        return false;
    }

    async createVerifyEmailToken(id: number, username: string, role: Role, emailIsVerified: boolean){
        const payload = {
            id,
            username,
            role,
            emailIsVerified
        }
        return await this.jwtService.sign(payload, {expiresIn : '15m'})
    }
}
