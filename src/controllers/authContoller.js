import registerUserServices from "../services/authServices";

const registerUserController = async (req, res) => {
  const user = await registerUserServices(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
};

export default registerUserController;
