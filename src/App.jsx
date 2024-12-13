import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { publishRoutes, privateRoutes } from "./routes/AppRoute";
import { Fragment, useEffect } from "react"; // Added useEffect import
import DefaultLayout from "./layouts/DefaultLayout";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { openLoginModal } from "./redux/actions/modalActions";
import { QueryClient, QueryClientProvider } from 'react-query';
import RoutePath from "./routes/RoutePath";

const queryClient = new QueryClient();

const RouteWrapper = ({ component: Component, layout: Layout, path }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user?.role);
  console.log(userRole);
  

  useEffect(() => {
    if (privateRoutes.some(route => route.path === path) && !isAuthenticated) {
      toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục.");
      navigate(RoutePath.AUTH);
    }
    // if(userRole === 'user' && (path === RoutePath.ADMIN || path === RoutePath.ADMIN_ACCOUNT_LIST || path === RoutePath.ADMIN_DESTINATION_MANAGEMENT || path === RoutePath.ADMIN_REPORT || path === RoutePath.ADMIN_TRANSACTION || path === RoutePath.ADMIN_TRIP_HISTORY)) {
    //   navigate(RoutePath.HOMEPAGE);
    //   toast.error("Bạn không có quyền truy cập trang này.");
    // }
    // if(userRole === 'admin' && (path !== RoutePath.ADMIN && path !== RoutePath.ADMIN_ACCOUNT_LIST && path !== RoutePath.ADMIN_DESTINATION_MANAGEMENT && path !== RoutePath.ADMIN_REPORT && path !== RoutePath.ADMIN_TRANSACTION && path !== RoutePath.ADMIN_TRIP_HISTORY && path !== RoutePath.AUTH)) {
    //   navigate(RoutePath.ADMIN);
    //   toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục");
    // } 
    // if(userRole === 'local' && (path !== RoutePath.LOCAL_CALENDAR_MANAGEMENT && path !== RoutePath.LOCAL_PLAN_MANAGEMENT && path !== RoutePath.LOCAL_STATICTIS && path !== RoutePath.LOCAL_TRIP_HISTORY && path !== RoutePath.LOCAL_WALLET_MANAGEMENT && path !== RoutePath.AUTH)) {
    //   navigate(RoutePath.LOCAL);
    //   toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục");
    // }
   
  }, [dispatch, isAuthenticated, path, userRole]);

  if (privateRoutes.some(route => route.path === path) && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (Layout === null) {
    return (
      <Fragment>
        <Component />
      </Fragment>
    );
  }

  const AppliedLayout = Layout || DefaultLayout;

  return (
    <AppliedLayout>
      <Component />
    </AppliedLayout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {publishRoutes.map(({ path, component: Component, layout: Layout }, index) => (
            <Route
              key={index}
              path={path}
              element={<RouteWrapper component={Component} layout={Layout} path={path} />}
            />
          ))}
          {privateRoutes.map(({ path, component: Component, layout: Layout }, index) => (
            <Route
              key={index}
              path={path}
              element={<RouteWrapper component={Component} layout={Layout} path={path} />}
            />
          ))}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
