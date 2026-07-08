import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import staffRouter from "./staff";
import membersRouter from "./members";
import requestsRouter from "./requests";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(staffRouter);
router.use(membersRouter);
router.use(requestsRouter);
router.use(settingsRouter);
router.use(dashboardRouter);

export default router;
