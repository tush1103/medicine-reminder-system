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

    return this.ordersService.createOrder(dto);
  }
}
