
import DefaultLayout from "../layouts/DefaultLayout"
import Auth from "../pages/Auth"
import Home from "../pages/Home"
import RoutePath from "./RoutePath"
const publishRoutes = [
    { path: RoutePath.AUTH, component: Auth, layout: null },
]

const privateRoutes = [
    { path: RoutePath.HOMEPAGE, component: Home, layout: DefaultLayout },
]

export { publishRoutes, privateRoutes }