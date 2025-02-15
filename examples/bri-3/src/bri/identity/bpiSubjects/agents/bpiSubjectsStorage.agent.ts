import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectStorageAgent extends PrismaService {
  async getBpiSubjectById(id: string): Promise<BpiSubject> {
    const bpiSubjectModel = await this.bpiSubject.findUnique({
      where: { id: id },
    });

    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new BpiSubject( // TODO: Write generic mapper prismaModel -> domainObject
      bpiSubjectModel.id,
      bpiSubjectModel.name,
      bpiSubjectModel.description,
      bpiSubjectModel.type,
      bpiSubjectModel.publicKey,
    );
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.bpiSubject.findMany();
    return bpiSubjectModels.map((bp) => {
      return new BpiSubject(
        bp.id,
        bp.name,
        bp.description,
        bp.type,
        bp.publicKey,
      );
    });
  }

  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const newBpiSubjectModel = await this.bpiSubject.create({
      // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        name: bpiSubject.name,
        description: bpiSubject.description,
        publicKey: bpiSubject.publicKey,
        type: bpiSubject.type,
      },
    });

    return new BpiSubject(
      newBpiSubjectModel.id,
      newBpiSubjectModel.name,
      newBpiSubjectModel.description,
      newBpiSubjectModel.type,
      newBpiSubjectModel.publicKey,
    );
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const newBpiSubjectModel = await this.bpiSubject.update({
      where: { id: bpiSubject.id },
      data: {
        name: bpiSubject.name,
        description: bpiSubject.description,
        publicKey: bpiSubject.publicKey,
        type: bpiSubject.type,
      },
    });

    return new BpiSubject(
      newBpiSubjectModel.id,
      newBpiSubjectModel.name,
      newBpiSubjectModel.description,
      newBpiSubjectModel.type,
      newBpiSubjectModel.publicKey,
    );
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }
}
