"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Notification = {
    id: number;
    text: string;
    error?: boolean;
};

type NotificationContextType = {
    notifications: Notification[];
    pushNotification: (text: string, error?: boolean) => void;
    removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const pushNotification = (text: string, error: boolean = false) => {
        setNotifications((prev) => [
            ...prev,
            {
                id: Date.now(),
                text,
                error,
            },
        ]);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter(notification => notification.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, pushNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
