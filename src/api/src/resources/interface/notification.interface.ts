export interface NotificationInterface {
    resource: string;
    user_id: string;
    topic: string;
    application_id: string;
    attempts: number;
    sent: Date;
    delivered: Date;
}
