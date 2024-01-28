import {Logger as DBLogger, QueryRunner} from 'typeorm';
import {Logger} from '@nestjs/common';

export class DatabaseLogger implements DBLogger {
    private logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        switch (level) {
            case 'info':
                this.logger.debug(message, this.queryRunnerToString(queryRunner));
                break;
            case 'log':
                this.logger.log(message, this.queryRunnerToString(queryRunner));
                break;
            case 'warn':
                this.logger.warn(message, this.queryRunnerToString(queryRunner));
                break;
        }
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.logger.log(`Migration: ${message}`, this.queryRunnerToString(queryRunner))
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.log(`Query: ${query}${parameters ? '  ' + JSON.stringify(parameters) : ''}`, this.queryRunnerToString(queryRunner))
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.error(`Query Error: ${error}, Query: ${query}${parameters ? '  ' + JSON.stringify(parameters) : ''}`, this.queryRunnerToString(queryRunner))
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.logger.warn(`Query Slow: ${time}, Query: ${query}${parameters ? '  ' + JSON.stringify(parameters) : ''}`, this.queryRunnerToString(queryRunner))
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.logger.log(`Schema Build: ${message}`, this.queryRunnerToString(queryRunner))
    }

    private queryRunnerToString(queryRunner?: QueryRunner) {
        return queryRunner && queryRunner.data['request'] ? '(' + queryRunner.data['request'].url + ') ' : '';
    }
}
