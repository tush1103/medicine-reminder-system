import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { DATABASE_POOL } from '../database/database.provider';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DATABASE_POOL) private readonly db: Pool,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const orderId = uuidv4();

    await this.db.execute(
      `INSERT INTO orders (id, user_id, user_email, user_phone, medicine_name, dosage_frequency, supply_days)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, dto.userId, dto.userEmail, dto.userPhone, dto.medicineName, dto.dosageFrequency, dto.supplyDays],
    );

    await this.kafkaProducer.emit('order.placed', { orderId, ...dto });

    return { orderId, message: 'Order placed successfully' };
  }
}
