import jwt from "jsonwebtoken";

/**
 * extract JWT from Authorization header and decode the JWT to return UID of user
 * @param {object} request , http request object that is returned as part of prisma context
 * @returns {String} id: the UID of the user
 */
const getUserId = request => {
  const headerAuth = request.request.headers.authorization;

  //check headerAuth exists
  if (!headerAuth) {
    throw new Error("Authentication required");
  }

  // remove 'bearer' from header string
  let token = headerAuth.replace("Bearer ", "");

  const decodedUser = jwt.verify(token, "jwt-secret");


  return decodedUser.id
};


export default getUserId;
