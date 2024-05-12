import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../../components/core/DataTable";
import { useCallback } from "react";
import { UserData } from "../../../models/tables/UserData";
import axiosInstance from "../../../utils/axios";
import { UserRole } from "../../../models/auth/User";
import axios from "axios";
import { Container } from "@mui/material";

const UsersTab = () => {
  const handleUserEdit = useCallback(async (user: Partial<UserData>) => {
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, {
        userRole: user.role!,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new Error(error.response?.data || "An error occurred");

      throw error;
    }
  }, []);

  return (
    <Container className="mt-20 w-full px-0">
      <h1>Users</h1>
      <DataTable
        apiUrl="/users"
        columns={columns}
        onEditEntry={handleUserEdit}
      />
    </Container>
  );
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "User Id",
    align: "left",
    headerAlign: "left",
    flex: 0.4,
  },
  {
    field: "firstName",
    headerName: "First Name",
    align: "left",
    headerAlign: "left",
    flex: 0.3,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    align: "left",
    headerAlign: "left",
    flex: 0.3,
  },
  {
    field: "email",
    headerName: "Email",
    align: "left",
    headerAlign: "left",
    flex: 0.5,
  },
  {
    field: "phoneNumber",
    headerName: "Phone Number",
    align: "left",
    headerAlign: "left",
    flex: 0.4,
  },
  {
    field: "role",
    headerName: "User Role",
    type: "singleSelect",
    valueOptions: [
      { value: UserRole.Admin, label: "Admin" },
      { value: UserRole.User, label: "User" },
      { value: UserRole.AirlineOperator, label: "Airline Operator" },
    ],
    align: "left",
    headerAlign: "left",
    editable: true,
    flex: 0.3,
  },
];

export default UsersTab;
