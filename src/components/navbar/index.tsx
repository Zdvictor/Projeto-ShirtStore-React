import { NavLink } from "react-router-dom";
import { FaHome, FaTshirt, FaShoppingCart, FaUser } from "react-icons/fa";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: <FaHome size={22} />,
  },
  {
    to: "/products",
    label: "Produtos",
    icon: <FaTshirt size={22} />,
  },
  {
    to: "/cart",
    label: "Carrinho",
    icon: <FaShoppingCart size={22} />,
  },
  {
    to: "/profile",
    label: "Perfil",
    icon: <FaUser size={22} />,
  },
];

const BottomNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-700 border-t border-gray-200 shadow-lg md:hidden">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-colors duration-200 px-2 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-indigo-400"
                }`
              }
              end={item.to === "/"}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavbar; 