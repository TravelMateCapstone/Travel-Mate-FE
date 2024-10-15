import AdminLayout from "../layouts/AdminLayout"
import DetailLayout from "../layouts/DetailLayout"
import HomeFeedLayout from "../layouts/HomeFeedLayout"
import ListLayout from "../layouts/ListLayout"
import AccountList from "../pages/Admin/AccountList"
import IncomeStatistic from "../pages/Admin/IncomeStatistic"
import EventDetail from "../pages/Events/EventDetail"
import EventList from "../pages/Events/EventList"
import GroupDetail from "../pages/Groups/GroupDetail"
import GroupList from "../pages/Groups/GroupList"
import Home from "../pages/Home"
import RoutePath from "./RoutePath"



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
]

export { publishRoutes, privateRoutes }