const userDto = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthDate: user.birthDate,
    image: user.image,
    isAdmin: user.isAdmin,
    notifications: user.notifications,
    friends: user.friends
  };
};

export default userDto;
