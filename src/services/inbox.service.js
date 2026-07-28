import { buildFormData } from '@/utils/buildFormData.js'
import { apiClient } from './apiClient.js'

/**
 * Real chat & notifications API — endpoints exactly as defined in the Postman
 * collection ("chat" folder + `notifications`). Method names, payloads and
 * return shapes match the mock implementation (src/mocks/inbox.mock.js)
 * one-for-one, so going live only means flipping the façade in
 * src/services/index.js — no component, business logic or routing changes.
 */
export const inboxService = {
  getConversations: () => apiClient.get('conversations'),

  getConversationMessages: (convId) => apiClient.get(`conversation/${convId}`),

  newConversation: (userId) => apiClient.get(`new_conversation/${userId}`),

  sendMessage: ({ message, conv_id, receiver }) =>
    apiClient.postForm('send_message', buildFormData({ message, conv_id, receiver })),

  searchUser: (name) => apiClient.postForm('search_user', buildFormData({ name })),

  getNotifications: () => apiClient.get('notifications'),

  // TODO(backend): the Postman collection has no "mark notification read"
  // endpoint yet — resolve locally so the notification → conversation flow
  // keeps working; replace with the real call once the backend exposes one.
  markNotificationRead: () => Promise.resolve({ success: true }),

  // TODO(backend): no dedicated unread-counts endpoint in the collection —
  // derived from `conversations` + `notifications` until one exists.
  getUnreadCounts: async () => {
    const [conversations, notifications] = await Promise.all([
      apiClient.get('conversations'),
      apiClient.get('notifications'),
    ])
    const convList = Array.isArray(conversations) ? conversations : (conversations?.data ?? [])
    const notifList = Array.isArray(notifications) ? notifications : (notifications?.data ?? [])
    return {
      messages: convList.reduce((sum, c) => sum + Number(c.unread_count ?? 0), 0),
      notifications: notifList.filter((n) => !n.read).length,
    }
  },
}
