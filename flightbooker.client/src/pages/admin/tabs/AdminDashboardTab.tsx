import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  Divider,
  CardHeader,
  CardContent,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Complaint } from "../../../models/tables/Complaint";
import { ComplaintMetrics } from "../../../models/DTOs/ComplaintMetrics";
import axiosInstance from "../../../utils/axios";
import { useAuth } from "../../../hooks/use-auth";
import axios from "axios";
import dayjs from "dayjs";

interface Metrics {
  unresolvedComplaints: number;
  complaintsAssignedThisMonth: number;
  complaintsIssuedThisWeek: number;
  totalUsers: number;
  recentComplaints: Complaint[];
}

const AdminDashboardTab: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    unresolvedComplaints: 0,
    complaintsAssignedThisMonth: 0,
    complaintsIssuedThisWeek: 0,
    totalUsers: 0,
    recentComplaints: [],
  });
  const { user } = useAuth();

  // Fetch metrics data from backend
  const fetchMetrics = useCallback(async () => {
    try {
      const complaintsResponse = await axiosInstance.get<ComplaintMetrics>(
        `/complaints/metrics?id=${user?.userId}`
      );
      const userCountResponse = await axiosInstance.get<number>("/users/count");

      setMetrics({
        unresolvedComplaints: complaintsResponse.data.unresolvedComplaints,
        complaintsAssignedThisMonth:
          complaintsResponse.data.complaintsAssignedThisMonth,
        complaintsIssuedThisWeek:
          complaintsResponse.data.complaintsIssuedThisWeek,
        recentComplaints: complaintsResponse.data.recentComplaints,
        totalUsers: userCountResponse.data,
      } as Metrics);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data)
        console.error("Axios error:", error.response);
      else console.error("Error fetching metrics:", error);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <Container className="py-10">
      <Typography
        variant="h3"
        gutterBottom
        className="text-background font-black mb-10"
      >
        Admin Dashboard
      </Typography>
      {metrics && (
        <>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Unresolved Complaints"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.unresolvedComplaints}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Complaints Assigned This Month"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.complaintsAssignedThisMonth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Complaints Issued This Week"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.complaintsIssuedThisWeek}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="text-center h-full drop-shadow-lg">
                <CardHeader
                  titleTypographyProps={{
                    variant: "h6",
                    className: "font-light text-3xl text-background",
                  }}
                  title="Total Users"
                />
                <Divider />
                <CardContent>
                  <Typography variant="h4" className="py-4 text-6xl">
                    {metrics.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider className="my-12 border-2" />

          <Typography variant="h5" gutterBottom>
            Recent Complaints
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Recent Complaints Table">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date Issued</TableCell>
                  <TableCell align="left">Resolved?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.recentComplaints.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {complaint.id}
                    </TableCell>
                    <TableCell align="left">{complaint.description}</TableCell>
                    <TableCell align="left">
                      {dayjs(complaint.dateIssued).format("DD/MM/YY HH:mm:ss")}
                    </TableCell>
                    <TableCell align="left">
                      {complaint.isResolved ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default AdminDashboardTab;
