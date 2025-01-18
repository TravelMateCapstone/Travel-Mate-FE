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

const adminRoutes = [RoutePath.ADMIN, RoutePath.ADMIN_ACCOUNT_LIST, RoutePath.ADMIN_REPORT, RoutePath.ADMIN_DESTINATION_MANAGEMENT, RoutePath.ADMIN_TRANSACTION, RoutePath.ADMIN_TRIP_HISTORY]; // Define admin routes

const RouteWrapper = ({ component: Component, layout: Layout, path }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user?.role);
  console.log(userRole);
  

  useEffect(() => {
    if (!isAuthenticated) {
      if (privateRoutes.some(route => route.path === path) && path === RoutePath.AUTH) {
        toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục.");
        navigate(RoutePath.AUTH);
      }
    } else {
      if (userRole === 'admin' && !adminRoutes.includes(path) && path !== RoutePath.AUTH) {
        toast.error("Admin không có quyền truy cập trang này.");
        navigate(RoutePath.ADMIN);
      } else if (userRole !== 'admin' && adminRoutes.includes(path)) {
        toast.error("Bạn không có quyền truy cập trang này.");
        navigate(RoutePath.HOMEPAGE);
      }
    }
  }, [dispatch, isAuthenticated, path, userRole]);

  if (privateRoutes.some(route => route.path === path) && !isAuthenticated) {
    return <Navigate to={RoutePath.AUTH} replace />;
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
