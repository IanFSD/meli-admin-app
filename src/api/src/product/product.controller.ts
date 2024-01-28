import {Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";
import {ProductService} from "./product.service";
import {JwtAuthGuard} from "../auth/guards/jwt.auth.guard";
import {Crud, CrudController} from "@nestjsx/crud";
import {ProductEntity} from "../resources/entity/product.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from 'express';

@Crud({
    model: {type: ProductEntity},
    query: {
        alwaysPaginate: true,
        join: {
            // Items: {eager: true, exclude: ['user_id', 'json'],},
            // ItemVariations: {eager: true, exclude: ['user_id', 'json']},
            children: {eager: true},
        },
        filter: [
            {field: "ProductEntity.parent_id", operator: "$isnull", value: true},
        ],
    },
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("api/product")
export class ProductController implements CrudController<ProductEntity> {
    constructor(public readonly service: ProductService) {
    }

    @Post("import")
    @UseInterceptors(FileInterceptor("file"))
    import(@UploadedFile() file: Express.Multer.File, @Body() data) {
        console.log("data file", file);
        console.log(JSON.stringify(data));
        return this.service.import(data, file);
    }
}
