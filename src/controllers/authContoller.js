import registerUserServices from "../services/authServices.js";

const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUserServices({ name, email, password });

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default registerUserController;
