import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    if (!dto.userId || !dto.userEmail || !dto.userPhone || !dto.medicineName || !dto.dosageFrequency || !dto.supplyDays) {
      throw new BadRequestException('All fields are required');
    }

    if (dto.dosageFrequency < 1 || dto.dosageFrequency > 4) {
      throw new BadRequestException('dosageFrequency must be between 1 and 4');
    }

    if (!Array.isArray(dto.doseTimes) || dto.doseTimes.length === 0) {
      throw new BadRequestException('doseTimes must be a non-empty array');
    }

    if (dto.doseTimes.length !== dto.dosageFrequency) {
      throw new BadRequestException('doseTimes.length must equal dosageFrequency');
    }

    const timeFormat = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!dto.doseTimes.every((t) => typeof t === 'string' && timeFormat.test(t))) {
      throw new BadRequestException('doseTimes entries must be in 24-hour HH:mm format');
    }

    if (new Set(dto.doseTimes).size !== dto.doseTimes.length) {
      throw new BadRequestException('doseTimes must not contain duplicates');
    }

    dto.doseTimes = [...dto.doseTimes].sort();

    return this.ordersService.createOrder(dto);
  }
}
