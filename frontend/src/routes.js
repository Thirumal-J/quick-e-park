import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import CheckerDashboardLayout from 'src/layouts/CheckerDashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import HomeView from 'src/views/home/HomeView';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import VehicleRegistrationView from 'src/views/auth/VehicleRegistrationView';
import ForgotPasswordView from 'src/views/auth/ForgotPasswordView';
import ResetPasswordView from 'src/views/auth/ResetPasswordView';
import NotFoundView from 'src/views/errors/NotFoundView';
import SettingsView from 'src/views/settings/SettingsView';
import VehiclesView from 'src/views/vehicles/VehiclesView';
import PaymentView from 'src/views/payment/PaymentView';
import ParkingTicketView from 'src/views/parkingticket/ParkingTicketView';
import ActiveTicketView from 'src/views/parkingticket/ParkingTicketView/ActiveTicket';
import TicketHistory from 'src/views/parkingticket/ParkingTicketView/TicketHistory';
import FinesView from 'src/views/fines/FinesView';
import CheckerLoginView from 'src/views/checker/CheckerLoginView';
import CheckerAccountView from 'src/views/checker/CheckerAccountView';
import CheckerFinesView from 'src/views/checker/CheckerFinesView';
import ScanAndCheck from 'src/views/checker/ScanAndCheck';
import UploadAndCheck from 'src/views/checker/UploadAndCheck';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'home', element: <HomeView /> },
      { path: 'account', element: <AccountView /> },
      { path: 'vehicles', element: <VehiclesView /> },
      { path: 'payment', element: <PaymentView /> },
      { path: 'fines', element: <FinesView /> },
      { path: 'parkingTicket', element: <ParkingTicketView /> },
      { path: 'parkingTicket/viewTicket', element: <ActiveTicketView /> },
      { path: 'ticketHistory', element: <TicketHistory /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> },
      { path: 'internal', element: <Navigate to="app/internal"/> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'register', element: <RegisterView /> },
      { path: 'vehicleRegistration', element: <VehicleRegistrationView /> },
      { path: 'resetPassword', element: <ResetPasswordView /> },
      { path: 'forgotPassword', element: <ForgotPasswordView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <LoginView /> },
      { path: 'app/internal/', element: <CheckerLoginView/> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'app/internal',
    element: <CheckerDashboardLayout />,
    children: [
      { path: '/', element: <CheckerLoginView /> },
      { path: 'home', element: <HomeView /> },
      { path: 'account', element: <CheckerAccountView /> },
      { path: 'scan&check', element: <ScanAndCheck /> },
      { path: 'upload&check', element: <UploadAndCheck /> },
      { path: 'vehicles', element: <VehiclesView /> },
      { path: 'fines', element: <CheckerFinesView /> },
      { path: 'parkingTicket', element: <ParkingTicketView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
];

export default routes;
