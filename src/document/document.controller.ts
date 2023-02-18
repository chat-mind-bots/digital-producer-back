import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentService } from 'src/document/document.service';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserRoleEnum } from 'src/user/enum/user-role.enum';
import { Documents } from 'src/document/document.schema';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { MongoIdPipe } from 'src/pipes/mongo-id.pipe';
import { ChangeDocumentDto } from 'src/document/dto/change-document.dto';

@Controller('document')
@ApiTags('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @ApiOperation({ summary: 'Create new document' })
  @ApiResponse({ status: 201, type: Documents })
  @Roles(UserRoleEnum.PRODUCER)
  @Post()
  async createDocument(@Req() req, @Body() dto: CreateDocumentDto) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.documentService.createDocument(dto, token);
  }

  @ApiOperation({ summary: 'Change document' })
  @ApiResponse({ status: 200, type: Documents })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Patch(':id')
  async changeDocument(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: ChangeDocumentDto,
  ) {
    const bearer = req.headers.authorization;
    const token = bearer.split('Bearer ')[1];
    return this.documentService.changeDocument(id, dto, token);
  }

  @ApiOperation({ summary: 'Get document' })
  @ApiResponse({ status: 200, type: Documents })
  @Roles(UserRoleEnum.USER)
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return this.documentService.getDocumentById(id);
  }

  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, type: Documents })
  @Roles(UserRoleEnum.PRODUCER)
  @UsePipes(MongoIdPipe)
  @Get(':id')
  async deleteDocument(@Param('id') id: string) {
    return this.documentService.deleteDocument(id);
  }
}
