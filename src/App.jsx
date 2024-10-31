import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { publishRoutes, privateRoutes } from "./routes/AppRoute";
import { Fragment } from "react"; 
import DefaultLayout from "./layouts/DefaultLayout";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"; 
import { openLoginModal } from "./redux/actions/modalActions"; 

const RouteWrapper = ({ component: Component, layout: Layout, path }) => {
  const dispatch = useDispatch(); 
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); 

  if (privateRoutes.some(route => route.path === path) && !isAuthenticated) {
    
    dispatch(openLoginModal());
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
      <Component />
    </AppliedLayout>
  );
};

function App() {
  return (
    <Router >
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
  );
}

export default App;
