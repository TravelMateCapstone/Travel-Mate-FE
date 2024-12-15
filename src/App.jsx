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
  const isAuthenticated = useSelector((state) => state.auth.token);
  const userRole = useSelector((state) => state.auth.user?.role);
  console.log(userRole);
  

  useEffect(() => {
    if (privateRoutes.some(route => route.path === path && route.path === RoutePath.AUTH) && !isAuthenticated) {
      toast.error("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập để tiếp tục.");
      navigate(RoutePath.AUTH);
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
