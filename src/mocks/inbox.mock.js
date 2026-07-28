/**
 * TEMPORARY mock chat & notifications — mirrors the Postman collection
 * (resources/sahm.postman_collection.json) "chat" folder and `notifications`
 * endpoint, method-for-method and payload-for-payload:
 *
 *   GET  conversations           → getConversations()
 *   GET  conversation/:id        → getConversationMessages(convId)
 *   GET  new_conversation/:user  → newConversation(userId)
 *   POST send_message            → sendMessage({ message, conv_id, receiver })
 *   GET  notifications           → getNotifications()
 *
 * Conversations, messages and notifications are persisted in the shared mock
 * store (storage.mock.js), so everything survives page reloads.
 *
 * Business rules enforced HERE in the service layer (never in components):
 *   - Only ONE conversation may exist between the same two users —
 *     `newConversation` / `sendMessage` always reuse the existing one.
 *   - Sending a message automatically creates a "new message" notification
 *     for the receiver, linked to the conversation (`conv_id`).
 *   - Opening a conversation marks its incoming messages as read.
 *
 * TODO(backend): replaced by `inboxService` (src/services/inbox.service.js)
 * when the façade in src/services/index.js is flipped. The Postman collection
 * has no "mark notification read" endpoint yet — until it exists,
 * `markNotificationRead` stays a service-layer concern (zero UI changes).
 */
import { ApiError } from '@/services/ApiError.js'
import { getCurrentMockUser } from './auth.mock.js'
import { getAllMockProperties, mockPropertyOwners } from './properties.mock.js'
import { readStore, writeStore } from './storage.mock.js'

const now = () => new Date().toISOString()

// ---------------------------------------------------------------------------
// Seed data — demo conversations/notifications for the demo accounts only.
// Newly registered users start with an empty inbox, exactly like the backend.
// ---------------------------------------------------------------------------
const SUPPORT_USER = { id: 904, name: 'خدمة عملاء سهم', image: null }

const seedConversations = () => [
  {
    id: 1,
    users: [{ id: 2, name: 'Demo User', image: null }, mockPropertyOwners.ahmed],
    created_at: '2026-07-18T09:00:00Z',
    updated_at: '2026-07-19T21:15:00Z',
  },
  {
    id: 2,
    users: [{ id: 2, name: 'Demo User', image: null }, mockPropertyOwners.sara],
    created_at: '2026-07-15T10:00:00Z',
    updated_at: '2026-07-16T19:05:00Z',
  },
  {
    id: 3,
    users: [{ id: 1, name: 'Sahm Admin', image: null }, SUPPORT_USER],
    created_at: '2026-07-10T13:00:00Z',
    updated_at: '2026-07-10T13:45:00Z',
  },
]

const seedMessages = () => ({
  1: [
    {
      id: 101,
      conv_id: 1,
      sender_id: 2,
      receiver_id: 901,
      message: 'مرحباً، هل الفيلا ما زالت متاحة؟',
      created_at: '2026-07-18T09:00:00Z',
      read: true,
    },
    {
      id: 102,
      conv_id: 1,
      sender_id: 901,
      receiver_id: 2,
      message: 'أهلاً بك، نعم ما زالت متاحة.',
      created_at: '2026-07-19T20:40:00Z',
      read: false,
    },
    {
      id: 103,
      conv_id: 1,
      sender_id: 901,
      receiver_id: 2,
      message: 'هل العقار ما زال متاحاً للمعاينة يوم الخميس؟',
      created_at: '2026-07-19T21:15:00Z',
      read: false,
    },
  ],
  2: [
    {
      id: 201,
      conv_id: 2,
      sender_id: 2,
      receiver_id: 903,
      message: 'هل يمكن تحديد موعد للمعاينة؟',
      created_at: '2026-07-15T10:00:00Z',
      read: true,
    },
    {
      id: 202,
      conv_id: 2,
      sender_id: 903,
      receiver_id: 2,
      message: 'شكراً لك، تم الاتفاق على الموعد.',
      created_at: '2026-07-16T19:05:00Z',
      read: true,
    },
  ],
  3: [
    {
      id: 301,
      conv_id: 3,
      sender_id: 904,
      receiver_id: 1,
      message: 'تم حل التذكرة الخاصة بك. لا تتردد في التواصل معنا.',
      created_at: '2026-07-10T13:45:00Z',
      read: false,
    },
  ],
})

const seedNotifications = () => ({
  2: [
    {
      id: 1,
      type: 'message',
      title: 'رسالة جديدة',
      body: 'وصلتك رسالة جديدة من أحمد محمد.',
      conv_id: 1,
      created_at: '2026-07-19T21:15:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'listing',
      title: 'تم قبول إعلانك',
      body: 'أصبح عقارك "شقة مفروشة بغرفتين" ظاهراً الآن في صفحة العقارات.',
      created_at: '2026-07-18T14:05:00Z',
      read: false,
    },
    {
      id: 3,
      type: 'system',
      title: 'تحديث سياسة الخصوصية',
      body: 'قمنا بتحديث سياسة الخصوصية. ننصحك بالاطلاع على التغييرات.',
      created_at: '2026-07-15T08:00:00Z',
      read: true,
    },
    {
      id: 4,
      type: 'system',
      title: 'مرحباً بك في سهم',
      body: 'أكمل بياناتك الشخصية للحصول على تجربة أفضل.',
      created_at: '2026-07-01T09:00:00Z',
      read: true,
    },
  ],
  1: [
    {
      id: 5,
      type: 'message',
      title: 'رسالة جديدة',
      body: 'وصلتك رسالة جديدة من خدمة عملاء سهم.',
      conv_id: 3,
      created_at: '2026-07-10T13:45:00Z',
      read: false,
    },
  ],
})

const ensureSeeded = () => {
  if (readStore('inbox_seeded', false)) return
  writeStore('conversations', seedConversations())
  writeStore('chat_messages', seedMessages())
  writeStore('notifications', seedNotifications())
  writeStore('inbox_seeded', true)
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const readConversations = () => {
  ensureSeeded()
  return readStore('conversations')
}

const readMessages = () => {
  ensureSeeded()
  return readStore('chat_messages', {})
}

const readNotifications = () => {
  ensureSeeded()
  return readStore('notifications', {})
}

const unauthenticated = () => Promise.reject(new ApiError(401, 'Unauthenticated'))

/** Known chat users — property owners, support, or the current user. */
const findChatUser = (id) => {
  const num = Number(id)
  const known =
    Object.values(mockPropertyOwners).find((u) => u.id === num) ??
    (SUPPORT_USER.id === num ? SUPPORT_USER : null) ??
    getAllMockProperties()
      .map((p) => p.user)
      .find((u) => u && Number(u.id) === num)
  if (known) return { id: known.id, name: known.name, image: known.image ?? null }
  const current = getCurrentMockUser()
  if (current && Number(current.id) === num) {
    return { id: current.id, name: current.name, image: current.image ?? null }
  }
  return { id: num, name: 'مستخدم', image: null }
}

const otherUser = (conv, myId) =>
  conv.users.find((u) => Number(u.id) !== Number(myId)) ?? conv.users[0]

const toConversationView = (conv, myId, messagesByConv) => {
  const list = messagesByConv[String(conv.id)] ?? []
  const last = list[list.length - 1]
  return {
    id: conv.id,
    user: otherUser(conv, myId),
    last_message: last?.message ?? '',
    unread_count: list.filter((m) => Number(m.receiver_id) === Number(myId) && !m.read).length,
    updated_at: conv.updated_at,
  }
}

/** The single-conversation rule — one conversation per pair of users, ever. */
const findConversationBetween = (conversations, a, b) =>
  conversations.find((conv) => {
    const ids = conv.users.map((u) => Number(u.id))
    return ids.includes(Number(a)) && ids.includes(Number(b))
  }) ?? null

const ensureConversationWith = (userId) => {
  const me = getCurrentMockUser()
  const conversations = readConversations()
  const existing = findConversationBetween(conversations, me.id, userId)
  if (existing) return existing
  const conv = {
    id: conversations.reduce((max, c) => Math.max(max, Number(c.id)), 0) + 1,
    users: [{ id: me.id, name: me.name, image: me.image ?? null }, findChatUser(userId)],
    created_at: now(),
    updated_at: now(),
  }
  writeStore('conversations', [...conversations, conv])
  return conv
}

// ---------------------------------------------------------------------------
// Service — same method names / payloads the future `inboxService` exposes.
// ---------------------------------------------------------------------------
export const mockInboxService = {
  getConversations: () => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const messagesByConv = readMessages()
    const list = readConversations()
      .filter((conv) => conv.users.some((u) => Number(u.id) === Number(me.id)))
      .map((conv) => toConversationView(conv, me.id, messagesByConv))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    return Promise.resolve(list)
  },

  getConversationMessages: (convId) => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const conv = readConversations().find(
      (c) =>
        String(c.id) === String(convId) &&
        c.users.some((u) => Number(u.id) === Number(me.id)),
    )
    if (!conv) return Promise.reject(new ApiError(404, 'Conversation not found'))
    const all = readMessages()
    const key = String(conv.id)
    // Opening the conversation marks its incoming messages as read.
    all[key] = (all[key] ?? []).map((m) =>
      Number(m.receiver_id) === Number(me.id) ? { ...m, read: true } : m,
    )
    writeStore('chat_messages', all)
    return Promise.resolve({
      conversation: toConversationView(conv, me.id, all),
      messages: all[key].map((m) => ({
        id: m.id,
        conv_id: conv.id,
        message: m.message,
        created_at: m.created_at,
        is_sender: Number(m.sender_id) === Number(me.id),
        sender: findChatUser(m.sender_id),
      })),
    })
  },

  newConversation: (userId) => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    if (Number(userId) === Number(me.id)) {
      return Promise.reject(new ApiError(422, 'Cannot start a conversation with yourself'))
    }
    const conv = ensureConversationWith(userId)
    return Promise.resolve(toConversationView(conv, me.id, readMessages()))
  },

  sendMessage: ({ message, conv_id, receiver } = {}) => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const body = String(message ?? '').trim()
    if (!body) return Promise.reject(new ApiError(422, 'Message is required'))

    // Resolve the conversation — by id, or by receiver. Either way the
    // existing conversation between the two users is reused (no duplicates).
    let conv = null
    if (conv_id != null && conv_id !== '') {
      conv = readConversations().find((c) => String(c.id) === String(conv_id)) ?? null
    }
    if (!conv && receiver != null) conv = ensureConversationWith(receiver)
    if (!conv) return Promise.reject(new ApiError(404, 'Conversation not found'))

    const to = otherUser(conv, me.id)
    const record = {
      id: Date.now(),
      conv_id: conv.id,
      sender_id: me.id,
      receiver_id: to.id,
      message: body,
      created_at: now(),
      read: false,
    }
    const all = readMessages()
    const key = String(conv.id)
    all[key] = [...(all[key] ?? []), record]
    writeStore('chat_messages', all)

    writeStore(
      'conversations',
      readConversations().map((c) =>
        String(c.id) === String(conv.id) ? { ...c, updated_at: record.created_at } : c,
      ),
    )

    // Business rule: a message automatically notifies the receiver.
    const notifications = readNotifications()
    const target = String(to.id)
    notifications[target] = [
      {
        id: record.id + 1,
        type: 'message',
        title: 'رسالة جديدة',
        body: `وصلتك رسالة جديدة من ${me.name}.`,
        conv_id: conv.id,
        created_at: record.created_at,
        read: false,
      },
      ...(notifications[target] ?? []),
    ]
    writeStore('notifications', notifications)

    return Promise.resolve({
      success: true,
      message: {
        id: record.id,
        conv_id: conv.id,
        message: record.message,
        created_at: record.created_at,
        is_sender: true,
        sender: { id: me.id, name: me.name, image: me.image ?? null },
      },
    })
  },

  getNotifications: () => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const list = readNotifications()[String(me.id)] ?? []
    return Promise.resolve(
      [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    )
  },

  markNotificationRead: (notificationId) => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const all = readNotifications()
    const key = String(me.id)
    all[key] = (all[key] ?? []).map((n) =>
      String(n.id) === String(notificationId) ? { ...n, read: true } : n,
    )
    writeStore('notifications', all)
    return Promise.resolve({ success: true })
  },

  /** Total unread counts (messages + notifications) for future badges. */
  getUnreadCounts: () => {
    const me = getCurrentMockUser()
    if (!me) return unauthenticated()
    const messagesByConv = readMessages()
    const messages = readConversations()
      .filter((conv) => conv.users.some((u) => Number(u.id) === Number(me.id)))
      .reduce(
        (sum, conv) => sum + toConversationView(conv, me.id, messagesByConv).unread_count,
        0,
      )
    const notifications = (readNotifications()[String(me.id)] ?? []).filter(
      (n) => !n.read,
    ).length
    return Promise.resolve({ messages, notifications })
  },
}
