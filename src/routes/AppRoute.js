import AdminLayout from "../layouts/AdminLayout"
import DetailLayout from "../layouts/DetailLayout"
import HomeFeedLayout from "../layouts/HomeFeedLayout"
import ListLayout from "../layouts/ListLayout"
import ProfileLayout from "../layouts/ProfileLayout"
import AccountList from "../pages/Admin/AccountList"
import IncomeStatistic from "../pages/Admin/IncomeStatistic"
import EventCreated from "../pages/Events/EventCreated"
import EventDetail from "../pages/Events/EventDetail"
import EventJoined from "../pages/Events/EventJoined"
import EventList from "../pages/Events/EventList"
import GroupCreated from "../pages/Groups/GroupCreated"
import GroupDetail from "../pages/Groups/GroupDetail"
import GroupJoined from "../pages/Groups/GroupJoined"
import GroupList from "../pages/Groups/GroupList"
import Home from "../pages/Home"
import RoutePath from "./RoutePath"
import EditProfile from "../pages/Profile/EditProfile"
import EditMyHome from "../pages/Profile/EditMyHome"
import Setting from "../pages/Setting"
import NavBarLayout from "../layouts/NavBarLayout"
import Profile from "../pages/Profile/Profile"




const publishRoutes = [
    { path: RoutePath.HOMEPAGE, component: Home, layout: HomeFeedLayout },
    { path: RoutePath.EVENT, component: EventList, layout: ListLayout },
    { path: RoutePath.EVENT_DETAILS, component: EventDetail, layout: DetailLayout },
    { path: RoutePath.GROUP, component: GroupList, layout: ListLayout },
    { path: RoutePath.GROUP_DETAILS, component: GroupDetail, layout: DetailLayout },
]

const privateRoutes = [
    { path: RoutePath.ADMIN, component: IncomeStatistic, layout: AdminLayout },
    { path: RoutePath.ADMIN_ACCOUNT_LIST, component: AccountList, layout: AdminLayout },
    { path: RoutePath.GROUP_CREATED, component: GroupCreated, layout: ListLayout },
    { path: RoutePath.GROUP_JOINED, component: GroupJoined, layout: ListLayout },
    { path: RoutePath.EVENT_CREATED, component: EventCreated, layout: ListLayout },
    { path: RoutePath.EVENT_JOINED, component: EventJoined, layout: ListLayout },
    { path: RoutePath.PROFILE, component: Profile, layout: ProfileLayout },
    { path: RoutePath.PROFILE_EDIT, component: EditProfile, layout: ProfileLayout},
    { path: RoutePath.PROFILE_EDIT_MY_HOME, component: EditMyHome, layout: ProfileLayout},
    { path: RoutePath.SETTING, component: Setting, layout: NavBarLayout},
]

export { publishRoutes, privateRoutes }