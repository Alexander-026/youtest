import ApiError from "../exceptions/apiError.js";
import { validateAccessToken } from "../service/tokenService.js";

const authMiddleWare = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log("one")
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      console.log("two")
      return next(ApiError.UnauthorizedError());
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      console.log("three")
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log("four")
    return next(ApiError.UnauthorizedError());
  }
};


const authorizeAdmin = (req, res, next) => {
  if ( req.user && req.user.user.isAdmin) {
    next();
  } else {
    return next(ApiError.UnauthorizedAdminError())
  }
};


export  {authMiddleWare, authorizeAdmin};
