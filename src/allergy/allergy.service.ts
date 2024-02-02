// allergy.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allergy } from './entities/allergy.entity';
import { CreateAllergyDto } from './dto/create-allergy.dto';

@Injectable()
export class AllergyService {
  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: Repository<Allergy>,
  ) {}
  separateClause(text: string) {
    let textOld = '';
    while (text.length != textOld.length) {
      textOld = text;
      text = text.replace(/\d+\./, ' ');
    }
    textOld = textOld.replace('-', '').replace('\n', '');
    const result = [];
    for (const i of textOld.split(' ')) {
      if (i.length > 0) {
        result.push(i);
      }
    }
    return result;
  }

  async create(allergyData: CreateAllergyDto): Promise<Allergy> {
    // allergyData.type = await this.aTypeRepository.findOne({where:{id:allergyData.type_id}})
    return await this.allergyRepository.save(allergyData);
  }

  async remove(id: number): Promise<void> {
    const allergyToRemove = await this.findOne(id);
    if (!allergyToRemove) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    await this.allergyRepository.remove(allergyToRemove);
  }

  async update(id: number, allergyData: Partial<Allergy>): Promise<Allergy> {
    const allergyToUpdate = await this.findOne(id);
    if (!allergyToUpdate) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    Object.assign(allergyToUpdate, allergyData);
    return await this.allergyRepository.save(allergyToUpdate);
  }

  async findAll(): Promise<Allergy[]> {
    return await this.allergyRepository.find();
  }

  async findOne(id: number): Promise<Allergy> {
    const allergy = await this.allergyRepository.findOne({ where: { id: id } });
    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }
    return allergy;
  }
}
