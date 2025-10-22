import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };


  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">🚌 Bus Booking</h1>
      <div className="flex gap-4 text-end">
        {user?.role === "admin" && <Link to="/admin" className="">{user.userName.split()}</Link>}
        {user?.role === "user" && <Link to="/my-bookings">My Bookings</Link>}
        {token ? <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button> :""}
      </div>
    </nav>
  );
}
