import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { registerUserController, loginUserController, refreshUserController, logoutUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController)
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.get("/profile", authenticate, async (req, res, next) => {
  try {
    const user = await UsersCollection.findById(req.user);
    if (!user) throw createHttpError(404, "User not found");

    res.json({
      status: 200,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});


router.post('/refresh', ctrlWrapper(refreshUserController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
