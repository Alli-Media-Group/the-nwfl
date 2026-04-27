import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './RootLayout.scss';

export default function RootLayout() {
  return (
    <div className="root-layout">
      <Navbar />
      <main className="root-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
