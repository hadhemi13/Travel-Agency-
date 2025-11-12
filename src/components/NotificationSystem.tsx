import React, { useState, useEffect, createContext, useContext } from 'react';
import { BsCheckCircleFill, BsExclamationTriangleFill, BsInfoCircleFill, BsXLg } from 'react-icons/bs';

// Types de notifications
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
}

interface NotificationContextType {
    showNotification: (type: NotificationType, title: string, message: string) => void;
}

// Contexte pour les notifications
const NotificationContext = createContext<NotificationContextType | null>(null);

// Hook personnalisé
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification doit être utilisé dans NotificationProvider');
    }
    return context;
};

// Composant de notification individuelle
const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({
                                                                                             notification,
                                                                                             onClose,
                                                                                         }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const getStyles = () => {
        switch (notification.type) {
            case 'success':
                return {
                    bg: 'bg-green-500',
                    icon: <BsCheckCircleFill className="text-2xl" />,
                };
            case 'error':
                return {
                    bg: 'bg-red-500',
                    icon: <BsExclamationTriangleFill className="text-2xl" />,
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500',
                    icon: <BsExclamationTriangleFill className="text-2xl" />,
                };
            case 'info':
                return {
                    bg: 'bg-blue-500',
                    icon: <BsInfoCircleFill className="text-2xl" />,
                };
        }
    };

    const styles = getStyles();

    return (
        <div
            className={`transform transition-all duration-300 ${
                isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
        >
            <div className="bg-[#191b1d] rounded-lg shadow-2xl overflow-hidden max-w-md w-full border border-gray-700">
                <div className={`${styles.bg} h-1`}></div>
                <div className="p-4 flex items-start gap-3">
                    <div className={`${styles.bg} p-2 rounded-lg text-white flex-shrink-0`}>
                        {styles.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm mb-1">{notification.title}</h4>
                        <p className="text-gray-300 text-sm">{notification.message}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        aria-label="Fermer la notification"
                    >
                        <BsXLg className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Provider de notifications
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (type: NotificationType, title: string, message: string) => {
        const id = Math.random().toString(36).substring(7);
        setNotifications((prev) => [...prev, { id, type, title, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
                {notifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationItem
                            notification={notification}
                            onClose={() => removeNotification(notification.id)}
                        />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};