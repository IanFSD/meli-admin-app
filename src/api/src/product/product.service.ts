import {Injectable, Logger} from "@nestjs/common";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {getTrace} from "../resources/utilities/utils";
import {InjectRepository} from "@nestjs/typeorm";
import {Job, Queue} from "bull";
import {Repository} from "typeorm";
import {MonedaEnum, ProductEntity} from "../resources/entity/product.entity";
import * as Excel from "exceljs";
import {JobQueueCommand, JobQueueInterface,} from "../resources/interface/job.queue.interface";
import {InjectQueue} from "@nestjs/bull";
import {Express} from 'express';
import {ProductInterface} from "../resources/interface/product.interface";
import {NEWBYTES} from "src/resources/utilities/consts";

/**
 * ProductService se encarga de visualizar los producto
 */
@Injectable()
export class ProductService extends TypeOrmCrudService<ProductEntity> {
    private logger: Logger;

    constructor(@InjectQueue(process.env.REDIS_QUEUE) private readonly queue: Queue,
                @InjectRepository(ProductEntity) repo: Repository<ProductEntity>) {
        super(repo);
        this.logger = new Logger(this.constructor.name);
    }

    import(data, file: Express.Multer.File): Promise<void> {
        switch (data.codigo.toUpperCase()) {
            case "ELIT":
                this.ImportarDatosElit(file);
                break;
            case "NEWBYTES":
                this.ImportarDatosNewBytes(file);
                break;
            case "POLYTECH":
                this.ImportarDatosPolytech(file);
                break;
            case "CORCISA":
                this.ImportarDatosCorcisa(file);
                break;
        }
        return;
    }

    async ImportarDatosElit(file: Express.Multer.File) {
        try {
            console.log("Leyendo archivo Elit");

            let rubro;
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(file.buffer);
            const ws = workbook.getWorksheet(1);

            //await _this.MarcarTodosSinStock();
            //cantidad de fila del excels
            const filas = ws.lastRow.number;
            for (let fila = 12; fila < filas + 1; fila++) {
                const datosFilas = ws.getRow(fila).values;
                if (
                    !datosFilas[0] &&
                    datosFilas[1] &&
                    !datosFilas[2] &&
                    datosFilas[3]
                ) {
                    rubro = datosFilas[3];
                    rubro = rubro.substr(7, 50);
                }

                if (datosFilas[1] && datosFilas[2]) {
                    const newProduct: ProductInterface = {
                        active: true,
                        moneda: MonedaEnum.USD,
                        provider: "ELIT",
                        code: datosFilas[1],
                        description: datosFilas[3],
                        stock: datosFilas[10] ? datosFilas[10] : 0,
                        marca: datosFilas[2],
                        price: Number(datosFilas[4]),
                        // descuento: datosFilas[5] ? datosFilas[5] : 0,
                        // NuevoPrecio: datosFilas[6] ? datosFilas[6] : 0,
                        rubro: rubro,
                        iva: datosFilas[7] ? datosFilas[7] : 0
                        // impInt: datosFilas[8] ? datosFilas[8] : 0,
                        // etiqueta: datosFilas[9] ? datosFilas[9] : "",
                    };
                    const product = await this.repo.find({
                        provider: newProduct.provider,
                        code: newProduct.code,
                    });
                    if (product.length > 0) {
                        await this.repo.update({id: product[0].id}, newProduct);
                    } else {
                        await this.repo.save(newProduct);
                    }
                    this.updateItems(newProduct);
                }
            }
            return true;
        } catch (e) {
            console.log("Error al procesar archivo");
            console.log(e.message);
            return false;
        }
    }

    async ImportarDatosNewBytes(file: Express.Multer.File) {
        return await this.repo.manager.transaction(async (manager) => {
            console.log("Leyendo archivo New Bytes");
            let rubro;
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(file.buffer);
            const ws = workbook.getWorksheet(1);
            const filas = ws.lastRow.number;

            await this.MarcarTodosNoActivos(NEWBYTES);

            for (let fila = 1; fila < filas + 1; fila++) {
                const datosFilas = ws.getRow(fila).values;

                if (!datosFilas[0] && !datosFilas[1] && datosFilas[2]) {
                    rubro = datosFilas[2];
                }
                if (datosFilas[1] !== "CODIGO" && datosFilas[1]) {
                    //TOMA SOLO VALOR NUMERICO DEL IVA SIN %
                    const newProduct: ProductInterface = {
                        provider: NEWBYTES,
                        code: datosFilas[2],
                        fabricante: datosFilas[2],
                        description: datosFilas[3],
                        iva: Number(datosFilas[4].split("%")[0].replace(",", ".")),
                        stock: datosFilas[5],
                        garantia: datosFilas[6],
                        moneda: this.parseMoneda(datosFilas[7]),
                        price: Number(datosFilas[8].replace(",", ".")),
                        rubro,
                        active: true
                    };
                    const product = await this.repo.findOne({
                        provider: newProduct.provider,
                        code: newProduct.code,
                    });
                    if (product) {
                        await this.repo.update({id: product.id}, newProduct);
                    } else {
                        await this.repo.save(newProduct);
                    }
                    // this.updateItems(newProduct);
                }
            }
            return true;
        }).catch(err => {
            console.log("Error al procesar archivo");
            console.log(err.message);
            return false;
        })
    }

    async ImportarDatosCorcisa(file: Express.Multer.File) {
        try {
            console.log("Procesando datos Corcisa");

            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(file.buffer);
            const ws = workbook.getWorksheet(1);

            const filas = ws.lastRow.number;

            for (let fila = 9; fila < filas + 1; fila++) {
                const datosFilas = ws.getRow(fila).values;
                if (datosFilas[1] && datosFilas[2] && datosFilas[3]) {
                    const newProduct: ProductInterface = {
                        provider: "CORCISA",
                        code: datosFilas[1],
                        fabricante: datosFilas[2],
                        description: datosFilas[3].trim(),
                        marca: datosFilas[4].trim(),
                        rubro: datosFilas[5].trim(),
                        price: datosFilas[6] && datosFilas[6] === "Consultar" ? 0 : datosFilas[6],
                        moneda: this.parseMoneda(ws.getRow(fila).getCell(6).style.numFmt),
                        stock: datosFilas[7],
                        iva: datosFilas[8],
                        active: true,
                    };
                    const product = await this.repo.find({
                        provider: newProduct.provider,
                        code: newProduct.code,
                    });
                    if (product.length > 0) {
                        await this.repo.update({id: product[0].id}, newProduct);
                    } else {
                        await this.repo.save(newProduct);
                    }
                    this.updateItems(newProduct);
                }
            }
            return true;
        } catch (e) {
            console.log("Error al procesar archivo");
            console.log(e.message);
            return false;
        }
    }

    async ImportarDatosPolytech(file: Express.Multer.File) {
        try {
            console.log("Procesando datos Polytech");

            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(file.buffer);
            const ws = workbook.getWorksheet(1);

            //await _this.MarcarTodosSinStock();
            //cantidad de fila del excels
            const filas = ws.lastRow.number;
            for (let fila = 2; fila <= filas; fila++) {
                const datosFilas = ws.getRow(fila).values;
                const newProduct: ProductInterface = {
                    active: true,
                    moneda: MonedaEnum.USD,
                    provider: "POLYTECH",
                    fabricante: datosFilas[2],
                    code: datosFilas[1],
                    description: datosFilas[3] ? datosFilas[3] : "",
                    stock: datosFilas[6],
                    marca: datosFilas[5],
                    iva: datosFilas[8] ? datosFilas[8] : 0,
                    rubro: datosFilas[4],
                    // descripDetallada: datosFilas[10] ? datosFilas[10] : "",
                    // descripLarga: datosFilas[11],
                    // precioDolar: datosFilas[7],
                    // precioConIVA: datosFilas[9],
                    // listPrice: datosFilas[4],
                    price: Number(datosFilas[4]),
                };
                const product = await this.repo.find({
                    provider: newProduct.provider,
                    code: newProduct.code,
                });
                if (product.length > 0) {
                    await this.repo.update({id: product[0].id}, newProduct);
                } else {
                    await this.repo.save(newProduct);
                }
                this.updateItems(newProduct);
            }
            return true;
        } catch (e) {
            console.log("Error al procesar archivo");
            console.log(e.message);
            return false;
        }
    }

    async updateItems(item): Promise<Job> {
        const job: JobQueueInterface<any> = {
            command: JobQueueCommand.ITEMS_UPDATE,
            item: item,
        };
        try {
            return this.queue.add(process.env.BULK_JOB, job)
        } catch (err) {
            this.logger.error(`Error al encolar un job de MELI BULK - ${job}`, getTrace(err));
            throw err;
        }
    }

    parseMoneda(value) {
        let ret = MonedaEnum.ARS;
        if (value === 'U$S' ||
            value.toString().trim().toUpperCase().indexOf("USD", 0) > 0) {
            ret = MonedaEnum.USD;
        }
        return ret;
    }

    private async MarcarTodosNoActivos(provider: string) {
        await this.repo.find({provider: provider});
    }
}
