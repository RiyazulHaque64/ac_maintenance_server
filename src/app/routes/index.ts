import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { BlogRoutes } from "../module/Blog/Blog.routes";
import { FeatureRoutes } from "../module/Feature/Feature.routes";
import { FileRoutes } from "../module/File/File.routes";
import { UserRoutes } from "../module/User/User.routes";
import { UtilityRoutes } from "../module/Utility/Utility.routes";
import { ServiceRoutes } from "../module/Service/Service.routes";

const router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
  {
    path: "/service",
    route: ServiceRoutes,
  },
  {
    path: "/file",
    route: FileRoutes,
  },
  {
    path: "/feature",
    route: FeatureRoutes,
  },
  {
    path: "/utility",
    route: UtilityRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
