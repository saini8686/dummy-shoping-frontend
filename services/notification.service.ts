import api from './axiosInstance.service';

export interface NotificationPayload {
  userId: number;
  message: string;
  earnUserId?: number;
  earnUserName?: string;
  earnCoin?: number;
  earnType?: string;
  status?: string;
}

export interface Notification extends NotificationPayload {
  id: number;
  createdAt: string;
}

// 🟢 Create Notification
export const createNotification = async (data: NotificationPayload) => {
  try {
    const res = await api.post('/api/notifications', data);
    return res.data;
  } catch (error: any) {
    console.error('Error creating notification:', error);
    throw error?.response?.data || { message: 'Unknown error' };
  }
};

// 🔵 Get Notifications (optional userId filter)
export const getNotifications = async (userId?: number) => {
  try {
    const res = await api.get('/api/notifications', {
      params: userId ? { userId } : {},
    });
    return res.data;
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    throw error?.response?.data || { message: 'Unknown error' };
  }
};

// 🟡 Get Single Notification by ID
export const getNotificationById = async (id: number) => {
  try {
    const res = await api.get(`/api/notifications/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Error fetching notification:', error);
    throw error?.response?.data || { message: 'Unknown error' };
  }
};

// 🟠 Update Notification
export const updateNotification = async (id: number, data: Partial<NotificationPayload>) => {
  try {
    const res = await api.put(`/api/notifications/${id}`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error updating notification:', error);
    throw error?.response?.data || { message: 'Unknown error' };
  }
};

// 🔴 Delete Notification
export const deleteNotification = async (id: number) => {
  try {
    const res = await api.delete(`/api/notifications/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    throw error?.response?.data || { message: 'Unknown error' };
  }
};
