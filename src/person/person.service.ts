import { Role } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../app/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonService {
  constructor(private prisma : PrismaService){}

  async create(createPersonDto: CreatePersonDto) {
    const {username, password, firstName, lastName, email} = createPersonDto;
    
    //Check username exists or not
    let resultUser = await this.prisma.user.findUnique({
      where : {
        username
      }
    });
    if(resultUser){
      //username exists
      throw new HttpException('Username already exists.', HttpStatus.BAD_REQUEST);
    }

    //New username
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    resultUser = await this.prisma.user.create({
      data:{
        username : username,
        password : hashedPassword,
        role : Role.PERSON,

        person : {
          create: {
            firstName,
            lastName,
            email
          }
        }
      }
    });

    if(resultUser){
		  return;
		}
		else{
		  throw new HttpException('Failed to register, try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
		}

  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(username: string) {
    return `This action returns a #${username} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
