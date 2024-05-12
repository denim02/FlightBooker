import { Container, Grid, Typography } from "@mui/material"
import { useAuth } from "../hooks/use-auth";
import { UserRole } from "../models/auth/User";
import DefaultPageLayout from "../components/layouts/DefaultPageLayout";
import DashboardLayout from "../components/layouts/DashboardLayout";

const NotFoundPage = () => {
    const { user } = useAuth();

    const renderPage = () => (
        <Grid container className="w-full h-screen" justifyContent="center" alignItems="center">
        <Container>
            <Typography variant="h1" className="text-center font-light text-4xl">404 - Not Found</Typography>
        </Container>
        </Grid>
    );

    return (user == null || user.role === UserRole.User) ? (
        <DefaultPageLayout>{renderPage()}</DefaultPageLayout>
    ) : (
        <DashboardLayout basePath="/" navPaths={[]}>{renderPage()}</DashboardLayout>
    );
};

export default NotFoundPage;