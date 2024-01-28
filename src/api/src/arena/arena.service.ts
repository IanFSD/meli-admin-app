import {INestApplication} from "@nestjs/common";
import Arena from 'bull-arena';
import Bull from 'bull';

const {UI} = require('bull-board');
const {setQueues} = require('bull-board');
const Queue = require('bull');

export class ArenaService {
    setupArena(app: INestApplication) {
        const arena = Arena({
            Bull,
            queues: [{
                type: 'bull',
                name: process.env.REDIS_QUEUE,
                url: process.env.REDIS_URL,
                hostId: process.env.REDIS_QUEUE
            }]
        }, {
            basePath: '/arena',
            disableListen: true
        });
        app.use('/', arena);
    }

    setupBoard(app: INestApplication) {
        setQueues([new Queue(process.env.REDIS_QUEUE, {
            redis: process.env.REDIS_URL,
        })]);
        app.use('/board', UI);
    }
}
