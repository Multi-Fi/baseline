import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { GetAllBpiSubjectsQuery } from './getAllBpiSubjects.query';

@QueryHandler(GetAllBpiSubjectsQuery)
export class GetAllBpiSubjectsQueryHandler
  implements IQueryHandler<GetAllBpiSubjectsQuery>
{
  constructor(private readonly storageAgent: BpiSubjectStorageAgent) {}

  async execute() {
    const bpiSubjects = await this.storageAgent.getAllBpiSubjects();

    return bpiSubjects.map((bp) => {
      return {
        id: bp.id,
        name: bp.name,
        desc: bp.description,
        publicKey: bp.publicKey,
      } as BpiSubjectDto;
    });
  }
}
