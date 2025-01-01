import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import { publishRoutes, privateRoutes } from "./routes/AppRoute";
import { Fragment } from "react"; // Removed useEffect import
import DefaultLayout from "./layouts/DefaultLayout";
import { ToastContainer, } from "react-toastify";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();


// eslint-disable-next-line react/prop-types, no-unused-vars
const RouteWrapper = ({ component: Component, layout: Layout, path }) => {

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
