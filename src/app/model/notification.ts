import { NotificationType } from "./notificationType";
/**
 * Object representing a notification object that should displayed in "Snackbar" component 
 * message: The  message to displayed
 * actionText: The title of the action button (The button will just close the snackbar)
 * type: an enum representing the class name in "styles.scss" file
 */export interface Notification {
    message: string,
    actionText: string,
    type:NotificationType   
}