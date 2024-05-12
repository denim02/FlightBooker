import { Outlet } from "react-router-dom";
import DefaultPageLayout from "../../components/layouts/DefaultPageLayout";

const PassengerPage = () => {
  return (
    <DefaultPageLayout>
      <Outlet />
    </DefaultPageLayout>
  );
};

export default PassengerPage;
