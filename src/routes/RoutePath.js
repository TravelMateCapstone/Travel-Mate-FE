const RoutePath = {
    // Common routes
    HOMEPAGE: '/',
    LOGIN: '/login',
    REGISTER: '/register',

    // Groups
    GROUP: '/group',
    GROUP_DETAILS: '/group/details',
    GROUP_CREATE: '/group/create',
    GROUP_JOINED: '/group/joined',
    GROUP_JOIN_DETAILS: '/group/join/details',
    GROUP_MY_DETAILS: '/group/my/details',

    // Events
    EVENT: '/event',
    EVENT_DETAILS: '/event/details',

    // Settings and Profile
    SETTING: '/setting',
    PROFILE: '/profile',
    PROFILE_EDIT: '/profile/edit',
    DESTINATION: '/destination',
    HOME_EDIT: '/home/edit',

    // Chat
    CHAT: '/chat',

    // Search
    SEARCH_LIST_LOCAL: '/search/list/local',
    SEARCH_LIST_TRAVELLER: '/search/list/traveller',

    // Admin routes
    ADMIN: '/admin',
    ADMIN_ACCOUNT_LIST: '/admin/account-list',
    ADMIN_REPORT: '/admin/report',
    ADMIN_TRANSACTION: '/admin/transaction',
    ADMIN_TRIP_HISTORY: '/admin/trip-history',

    // Local routes
    LOCAL_WALLET_MANAGEMENT: '/local/wallet-management',
    LOCAL_TRIP_HISTORY: '/local/trip-history',
    LOCAL_CALENDAR_MANAGEMENT: '/local/calendar-management',
}

export default RoutePath;
