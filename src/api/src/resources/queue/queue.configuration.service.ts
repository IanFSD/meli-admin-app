import {Injectable} from "@nestjs/common";
import {BullModuleOptions, BullOptionsFactory} from "@nestjs/bull";

@Injectable()
export class QueueConfigurationService implements BullOptionsFactory {
    constructor() {
    }

    createBullOptions(): BullModuleOptions {
        let ret;
        if (process.env.REDIS_URL) {
            ret = {
                redis: process.env.REDIS_URL,
                defaultJobOptions: {
                    removeOnComplete: Number(process.env.REDIS_JOBS_REMOVE_ON_COMPLETE),
                    removeOnFail: Number(process.env.REDIS_JOBS_REMOVE_ON_FAIL)
                }
            };
        } else {
            ret = {
                redis: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                    password: process.env.REDIS_PASSWORD,
                    keepAlive: 10 * 1000,
                    showFriendlyErrorStack: true,
                    autoResubscribe: true,
                    maxRetriesPerRequest: 1,  // only retry failed requests once
                    enableOfflineQueue: true, // queue offline requests
                    retryStrategy: function (times) {
                        return 2000 // reconnect after 2 seconds
                    },
                    reconnectOnError: function (err) {
                        // only reconnect on error if the node you are connected to
                        // has switched to READONLY mode
                        return err.message.startsWith('READONLY')
                    }
                }
            }
        }
        return ret;
    }
}
