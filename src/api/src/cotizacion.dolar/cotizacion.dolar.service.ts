import {Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import axios from 'axios';
import {CotizacionDolarEntity} from "../resources/entity/cotizacion.dolar.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CotizacionDolarDto} from "../resources/dto/cotizacion.dolar.dto";
import cheerio = require('cheerio');

@Injectable()
export class CotizacionDolarService {
    private readonly url: string = 'http://www.bna.com.ar/Cotizador/MonedasHistorico';

    constructor(@InjectRepository(CotizacionDolarEntity) private readonly repository: Repository<CotizacionDolarEntity>) {
    }

    GetCotizacionDolar() {
        return this.repository.findOne({where: {id: 1}}).catch((err) => {
            Logger.error(err);
            return {};
        });
    }

    GrabarDolar(data: CotizacionDolarDto) {
        const res: CotizacionDolarEntity = new CotizacionDolarEntity();
        res.id = 1;
        res.cotizacion = data.cotizacion;
        res.fecha = data.fecha;
        return this.repository.save(res);
    }

    UpdateCotizacionDolar() {
        return this.GetCotizacionDolarDelBancoNacion()
            .then(res => {
                res.id = 1;
                return this.repository.save(res);
            });
    }

    GetCotizacionDolarDelBancoNacion(): Promise<CotizacionDolarEntity> {
        return axios.get(this.url)
            .then((res) => {
                const ret: CotizacionDolarEntity = new CotizacionDolarEntity();
                const xmlDom = cheerio.load(res.data);
                let td = xmlDom('td').filter(function () {
                    return xmlDom(this).text() === 'Dolar U.S.A';
                });
                if (td && td.length === 1) {
                    // @ts-ignore
                    ret.cotizacion = parseFloat(td.siblings()[1].children[0].data)
                }
                td = xmlDom('.titulo-cotizador');
                if (td && td.length === 1) {
                    // @ts-ignore
                    let fecha = td[0].children[0].data;
                    fecha = fecha.replace('Fecha: ', '');
                    const fechaArr = fecha.split('/');
                    ret.fecha = new Date(fechaArr[2], fechaArr[1] - 1, fechaArr[0]);
                }
                return ret;
            });
    }
}
