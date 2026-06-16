import { Outlet, useLocation } from "react-router";

import { useAuth } from "../features/auth/hooks/useAuth";

const AuthLayout = () => {
    const location = useLocation();

    useAuth(location.pathname);

    return <Outlet />;
};

export default AuthLayout;