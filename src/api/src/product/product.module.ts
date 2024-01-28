import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../resources/entity/product.entity";
import { BullModule } from "@nestjs/bull";
import { QueueConfigurationService } from "../resources/queue/queue.configuration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    BullModule.registerQueueAsync({
      name: process.env.REDIS_QUEUE,
      useClass: QueueConfigurationService,
    }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
