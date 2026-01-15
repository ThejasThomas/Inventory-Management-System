import  { Model } from "mongoose";
import type { Filter } from "mongodb";
import { IBaseRepository } from "../../domain/repositoryInterface/base_repository_interface";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async find(filter: Filter<T> = {}) {
    return this.model.find(filter);
  }

  async findAll(
    filter: Filter<T> = {},
    skip = 0,
    limit = 10,
    sort: any = { createdAt: -1 }
  ) {
    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean() as Promise<T[]>,
      this.model.countDocuments(filter),
    ]);

    return { items, total };
  }

  async findOne(filter: Filter<T>) {
    return this.model.findOne(filter).lean() as Promise<T>;
  }

  async save(data: Partial<T>) {
    return this.model.create(data);
  }

  async update(filter: Filter<T>, updateData: Partial<T>) {
    return this.model
      .findOneAndUpdate(filter, { $set: updateData }, { new: true })
      .lean() as Promise<T>;
  }

  async updateOne(filter: Filter<T>, updateData: Partial<T>) {
    return this.model.updateOne(filter, { $set: updateData });
  }

  async delete(filter: Filter<T>) {
    return this.model.findOneAndDelete(filter).lean() as Promise<T>;
  }

  async deleteAll(filter: Filter<T>) {
    await this.model.deleteMany(filter);
  }

  async findById(id: string) {
    return this.model.findById(id).lean() as Promise<T>;
  }

  async countDocuments(filter: Filter<T>) {
    return this.model.countDocuments(filter);
  }
}
