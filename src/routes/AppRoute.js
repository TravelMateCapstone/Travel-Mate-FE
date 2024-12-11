import AdminLayout from "../layouts/AdminLayout"
import DetailLayout from "../layouts/DetailLayout"
import HomeFeedLayout from "../layouts/HomeFeedLayout"
import ListLayout from "../layouts/ListLayout"
import ProfileLayout from "../layouts/ProfileLayout"
import AccountList from "../pages/Admin/AccountList"
import IncomeStatistic from "../pages/Admin/IncomeStatistic"
import EventCreated from "../pages/Events/EventCreated"
import EventJoined from "../pages/Events/EventJoined"
import EventList from "../pages/Events/EventList"
import GroupCreated from "../pages/Groups/GroupCreated"
import GroupDetail from "../pages/Groups/GroupDetail"
import GroupJoined from "../pages/Groups/GroupJoined"
import GroupList from "../pages/Groups/GroupList"
import Home from "../pages/Home"
import RoutePath from "./RoutePath"
import EditProfile from "../pages/Profile/EditProfile"
import Setting from "../pages/Setting"
import NavBarLayout from "../layouts/NavBarLayout"
import Profile from "../pages/Profile/Profile"
import EditMyHome from "../pages/Profile/EditMyHome"
import Chat from "../pages/Chat"
import AdminReport from "../pages/Admin/AdminReport"
import WalletManagement from "../pages/Admin/WalletManagement"
import TripHistory from "../pages/Admin/TripHistory"
import GroupManagement from "../pages/Groups/GroupManagement"
import Contract from "../pages/Contracts/Contract"
import CreateContract from "../pages/Contracts/CreateContract"
import DoneContract from "../pages/Contracts/DoneContract"
import FinishContract from "../pages/Contracts/FinishContract"
import OngoingContract from "../pages/Contracts/OngoingContract"
import PaymentContract from "../pages/Contracts/PaymentContract"
import ContractLayout from "../layouts/ContractLayout"
import Transaction from "../pages/Admin/Transaction"
import LocalIncomeStaticstic from "../pages/Local/LocalIncomeStaticstic"
import CalendarManagement from "../pages/Local/CalendarManagement"
import LocalTripHistory from "../pages/Local/LocalTripHistory"
import LocalWalletManagement from "../pages/Local/LocalWalletManagement"
import PlanManagemnet from "../pages/Local/PlanManagemnet"
import Destination from "../pages/Destination/Destination"
import SearchListLocal from "../pages/Search/SearchListLocal"
import SearchListTraveller from "../pages/Search/SearchListTraveller"
import MyProfile from "../pages/ProfileManagement/MyProfile"
import TourDetail from "../pages/Tour/TourDetail"
import Regulation from "../pages/Regulation"
import FailContract from "../pages/Contracts/FailContract"
import Login from "../pages/Auth/Auth"
import Destinationmanagement from "../pages/Admin/Destinationmanagement"
import FinishContractTraveller from "../pages/Contracts/FinishContractTraveller"

const publishRoutes = [
    { path: RoutePath.AUTH, component: Login, layout: null },
]

const privateRoutes = [
    { path: RoutePath.HOMEPAGE, component: Home, layout: HomeFeedLayout },
    { path: RoutePath.EVENT, component: EventList, layout: ListLayout },
    { path: RoutePath.GROUP, component: GroupList, layout: ListLayout },
    { path: RoutePath.GROUP_DETAILS, component: GroupDetail, layout: DetailLayout },
    { path: RoutePath.ADMIN, component: IncomeStatistic, layout: AdminLayout },
    { path: RoutePath.ADMIN_ACCOUNT_LIST, component: AccountList, layout: AdminLayout },
    { path: RoutePath.ADMIN_REPORT, component: AdminReport, layout: AdminLayout },
    { path: RoutePath.ADMIN_WALLET_MANAGEMENT, component: WalletManagement, layout: AdminLayout },
    { path: RoutePath.ADMIN_TRIP_HISTORY, component: TripHistory, layout: AdminLayout },
    { path: RoutePath.ADMIN_TRANSACTION, component: Transaction, layout: AdminLayout },
    { path: RoutePath.ADMIN_DESTINATION_MANAGEMENT, component: Destinationmanagement, layout: AdminLayout },

    { path: RoutePath.GROUP_CREATED, component: GroupCreated, layout: ListLayout },
    { path: RoutePath.Group_Management, component: GroupManagement, layout: DetailLayout },
    { path: RoutePath.GROUP_JOINED, component: GroupJoined, layout: ListLayout },

    { path: RoutePath.EVENT_CREATED, component: EventList, layout: ListLayout },
    { path: RoutePath.EVENT_JOINED, component: EventList, layout: ListLayout },
    { path: RoutePath.SEARCH_LIST_LOCAL, component: SearchListLocal, layout: NavBarLayout },
    { path: RoutePath.SEARCH_LIST_TRAVELLER, component: SearchListTraveller, layout: ListLayout },
    { path: RoutePath.EVENT_DETAILS, component: EventJoined, layout: DetailLayout },
    { path: RoutePath.EVENT_MANAGEMENT, component: EventCreated, layout: DetailLayout },

    { path: RoutePath.PROFILE, component: Profile, layout: ProfileLayout },
    { path: RoutePath.PROFILE_EDIT, component: EditProfile, layout: ProfileLayout },
    { path: RoutePath.PROFILE_EDIT_MY_HOME, component: EditMyHome, layout: ProfileLayout },
    { path: RoutePath.SETTING, component: Setting, layout: NavBarLayout },
    { path: RoutePath.CHAT, component: Chat, layout: NavBarLayout },
    { path: RoutePath.PROFILE_MY_PROFILE, component: MyProfile, layout: NavBarLayout },

    { path: RoutePath.OTHERS_PROFILE, component: Profile, layout: ProfileLayout },

    { path: RoutePath.CONTRACT, component: Contract, layout: ContractLayout },
    { path: RoutePath.CREATE_CONTRACT, component: CreateContract, layout: ContractLayout },
    { path: RoutePath.DONE_CONTRACT, component: DoneContract, layout: ContractLayout },
    { path: RoutePath.FINISH_CONTRACT, component: FinishContract, layout: ContractLayout },
    { path: RoutePath.ONGOING_CONTRACT, component: OngoingContract, layout: ContractLayout },
    { path: RoutePath.PAYMENT_CONTRACT, component: PaymentContract, layout: ContractLayout },
    { path: RoutePath.PAYMENT_FAILED_CONTRACT, component: FailContract, layout: ContractLayout },
    { path: RoutePath.FINISH_CONTRACT_TRAVELLER, component: FinishContractTraveller, layout: ContractLayout },

    { path: RoutePath.LOCAL_STATICTIS, component: LocalIncomeStaticstic, layout: AdminLayout },
    { path: RoutePath.LOCAL_CALENDAR_MANAGEMENT, component: CalendarManagement, layout: AdminLayout },
    { path: RoutePath.LOCAL_TRIP_HISTORY, component: LocalTripHistory, layout: AdminLayout },
    { path: RoutePath.LOCAL_WALLET_MANAGEMENT, component: LocalWalletManagement, layout: AdminLayout },
    { path: RoutePath.LOCAL_PLAN_MANAGEMENT, component: PlanManagemnet, layout: AdminLayout },

    { path: RoutePath.DESTINATION, component: Destination,  },
    { path: RoutePath.TOUR_DETAIL, component: TourDetail,  },
    { path: RoutePath.REGULATION, component: Regulation,  },
]

export { publishRoutes, privateRoutes }