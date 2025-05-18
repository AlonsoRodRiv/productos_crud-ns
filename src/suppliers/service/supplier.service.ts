import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entity/supplier.entity';
import { CreateSupplierDto } from '../dto/suppliersRequest.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private SupplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const Supplier = this.SupplierRepository.create(createSupplierDto);
    return this.SupplierRepository.save(Supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.SupplierRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: number): Promise<Supplier> {
    const Supplier = await this.SupplierRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return Supplier;
  }

  async update(id: number, updateSupplierDto: any): Promise<Supplier> {
    const Supplier = await this.findOne(id);

    // Merge the existing Supplier with the new data
    const updatedSupplier = this.SupplierRepository.merge(
      Supplier,
      updateSupplierDto,
    );

    return this.SupplierRepository.save(updatedSupplier);
  }

  async remove(id: number): Promise<void> {
    const Supplier = await this.findOne(id);
    await this.SupplierRepository.remove(Supplier);
  }
}
