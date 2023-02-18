import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Documents, DocumentsDocument } from 'src/document/document.schema';
import { Model } from 'mongoose';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { ChangeDocumentDto } from 'src/document/dto/change-document.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Documents.name)
    private readonly documentsModel: Model<DocumentsDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getDocumentById(id: string) {
    const document = await this.documentsModel.findById(id);
    if (!document) {
      throw new HttpException(
        'Document (document) not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return document;
  }

  async createDocument(dto: CreateDocumentDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);

    const document = await this.documentsModel.create({
      ...dto,
      owner: _id,
    });
    return this.getDocumentById(document._id);
  }

  async changeDocument(id: string, dto: ChangeDocumentDto, token: string) {
    const { _id } = await this.authService.getUserInfo(token);
    const document = await this.getDocumentById(id);
    if (String(_id) !== String(document.owner)) {
      throw new HttpException(
        `You not owner of this document`,
        HttpStatus.FORBIDDEN,
      );
    }
    await document.updateOne({ ...dto });
    return this.getDocumentById(document._id);
  }

  async deleteDocument(id: string) {
    const result = await this.documentsModel.findByIdAndDelete(id);
    return result;
  }
}
