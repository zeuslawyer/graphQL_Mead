import jwt from "jsonwebtoken";

/**
 * extract JWT from Authorization header and decode the JWT to return UID of user
 * @param {object} request , http request object that is returned as part of prisma context
 * @param {Bool} requireAuth-boolean (default=true) indicating whether user needs to be authorised to return the ID
 * @returns the UID of the user if user authenticated or error, or null if not, depending on requireAuth's value
 */
const getUserId = (request, requireAuth = true) => {
  const headerAuth = request.request.headers.authorization;

  // if user is authenticated, JWT exists, so return id
  if (headerAuth) {
    // remove 'bearer' from header string
    let token = headerAuth.replace("Bearer ", "");
    const decodedUser = jwt.verify(token, "jwt-secret");
    return decodedUser.id;
  }

  // if no JWT on header, check if auth required. If required through error.
  if (requireAuth) throw new Error("Authentication required.");

  //all other circumstances return only null
  return null; //  dont return undefined as will impact prisma.query in query.js
};

export default getUserId;
