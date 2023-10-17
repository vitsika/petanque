import { NotificationType } from "./notificationType";
export interface Notification {
    message: string,
    actionText: string,
    type:NotificationType   
}