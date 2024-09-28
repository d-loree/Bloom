import Login from "./components/auth/login/login";
import Register from "./components/auth/register/register";

import Header from "./components/header/header";
import Home from "./components/home/home";
import ViewFeedback from "./components/view_feedback/view_feedback";

import Root from "./components/root/root";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";
import Team from "./components/team/team";

import { AuthProvider } from "./contexts/authContext/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Root/>,
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
