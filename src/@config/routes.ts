// Define the route type
interface Route {
  label: string;
  link: string;
}

// Define your routes array
const routes: Route[] = [
  { label: "Users", link: "/users" },
  { label: "Products", link: "/products" },
  { label: "Categories", link: "/categories" },
  { label: "Orders", link: "/orders" },
  { label: "Reports", link: "/reports" },
  { label: "Settings", link: "/settings" },
];

export default routes;
