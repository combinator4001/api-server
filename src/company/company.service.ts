import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/app/prisma.service';
import { Role } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';




@Injectable()
export class CompanyService {
  constructor(private prisma : PrismaService){}

  async create(createCompanyDto: CreateCompanyDto) {
    const {username, password, name, email} = createCompanyDto;
    
    //Check company exists or not
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
        role : Role.COMPANY,

				company : {
					create: {
						name : name,
						email : email
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
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
