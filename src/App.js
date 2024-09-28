import { Navigate, useRoutes } from "react-router-dom";
import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";

import Header from "./components/header/header";
import Home from "./components/home/home";
import ViewFeedback from "./components/view_feedback/view_feedback";
import Form from "./components/form/form";

import Root from "./components/root/root";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";
import Team from "./components/team/team";

import { AuthProvider } from "./contexts/authContext/authContext";

function App() {

  const routesArray = [
    {
      path: "*", 
      element: <Navigate to="/" />, // Redirect to root
    },
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/inbox",
      element: <Inbox />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/team",
      element: <Team />,
    },
    {
      path: "/view-feedback",
      element: <ViewFeedback />,
    },
    {
      path: "/form",
      element: <Form />,
    },
  ];
  
  let routesElement = useRoutes(routesArray);
  
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
