import {Body, Controller, Post, Put, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody} from '@nestjs/swagger';
import {ItemService} from "./item.service";
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";
import {Crud, CrudController} from "@nestjsx/crud";
import {Job} from "bull";
import {ItemEntity} from "../resources/entity/item.entity";
import {LinkItemDto} from "../resources/dto/link.item.dto";
import {LinkItemVariationDto} from "../resources/dto/link.item.variation.dto";

@Crud({
    model: {type: ItemEntity},
    routes: {only: ["getManyBase"]},
    query: {
        alwaysPaginate: true,
        exclude: ['json'],
        join: {
            Variations: {eager: true, exclude: ['json']},
        }
    },
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/item')
export class ItemController implements CrudController<ItemEntity> {
    constructor(public service: ItemService) {
    }

    @Post('download-items')
    downloadItems(): Promise<Job> {
        return this.service.downloadItems();
    }

    @Post('update-items')
    updateItems(): Promise<Job> {
        return this.service.updateItems();
    }

    @Put('link-item')
    @ApiBody({type: LinkItemDto})
    linkItem(@Body() data: LinkItemDto): Promise<any> {
        return this.service.linkItem(data);
    }

    @Put('unlink-item')
    @ApiBody({type: LinkItemDto})
    unlinkItem(@Body() data: LinkItemDto): Promise<any> {
        return this.service.unlinkItem(data);
    }

    @Put('link-variation')
    @ApiBody({type: LinkItemVariationDto})
    linkVariation(@Body() data: LinkItemVariationDto): Promise<any> {
        return this.service.linkVariation(data);
    }

    @Put('unlink-variation')
    @ApiBody({type: LinkItemVariationDto})
    unlinkVariation(@Body() data: LinkItemVariationDto): Promise<any> {
        return this.service.unlinkVariation(data);
    }
}
