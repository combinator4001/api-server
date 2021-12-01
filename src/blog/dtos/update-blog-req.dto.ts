import { PartialType } from "@nestjs/swagger";
import { CreateBlogDto } from "./create-post.dto";

export class UpdateBlogReqDto extends PartialType(CreateBlogDto){}