import NotificationItem from "./notification-item";


function NotificationSection() {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
                <NotificationItem key={index} />
            ))}
        </div>
    )
}

export default NotificationSection;