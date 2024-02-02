import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Asset, AssetType } from './entities/asset.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { FileService } from './file.service';

@Injectable()
export class AssetService extends FileService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(AssetType)
    private readonly typeRepository: Repository<AssetType>,
    @InjectRepository(Activity)
    private readonly acRepository: Repository<Activity>,
  ) {
    super();
  }
  // method call controller
  async create(
    type: AssetType,
    activity: Activity,
    path: string,
  ): Promise<Asset> {
    const asset = this.assetRepository.create();
    asset.activityId = activity;
    asset.type = type;
    asset.path = path;
    return this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find();
  }

  async findAllByActivityId(activityId: number): Promise<Asset[]> {
    return this.assetRepository.find({
      where: { activityId: { id: activityId } },
      relations: ['activityId'],
    });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({ where: { id: id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }
  async findType(typeId: number): Promise<AssetType> {
    const asset = await this.typeRepository.findOne({ where: { id: typeId } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${typeId} not found`);
    }
    return asset;
  }
  genaratepath(file: Express.Multer.File) {
    let path = file.path;
    path = path.replace('\\', '/');
    path = path.replace('\\', '/');
    return path;
  }
  async updateMany(
    files: Express.Multer.File[],
    typeId: string,
    activityId: string,
    assets: DeepPartial<Asset>[],
  ) {
    const type = await this.findType(+typeId);
    const activity = await this.acRepository.findOne({
      where: { id: +activityId },
    });
    if (assets.length > 0 || files.length > 0) {
      const index = 0;
      for (const i of files) {
        const path = this.genaratepath(i);
        if (assets[index] == null) {
          await this.create(type, activity, path);
        } else {
          await this.update(assets[index].id, type, activity, path);
        }
      }
      // กรณี asset > files
      if (assets.length > files.length) {
        for (let i = index; i <= assets.length; i++) {
          await this.remove(assets[i].id);
        }
      }
    }
  }

  async update(
    id: number,
    type: AssetType,
    activity: Activity,
    path: string,
  ): Promise<Asset> {
    const asset = this.assetRepository.create();
    asset.id = id;
    asset.activityId = activity;
    asset.type = type;
    asset.path = path;
    return this.assetRepository.save(asset);
  }

  async remove(id: number): Promise<void> {
    const asset = await this.findOne(id); // Check if the asset exists
    this.removeImageInServer(asset.path);
    await this.assetRepository.remove(asset);
  }
}
