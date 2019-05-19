import jwt from "jsonwebtoken";

/**
 * extract JWT from Authorization header and decode the JWT to return UID of user
 * @param {object} request , http request object that is returned as part of prisma context
 * @returns {String  || undefined} id: the UID of the user if auser authenticated or undefined if not
 */
const getUserId = (request, requireAuth = true) => {
  const headerAuth = request.request.headers.authorization;

  //check headerAuth exists
  if (headerAuth) {
    // remove 'bearer' from header string
  let token = headerAuth.replace("Bearer ", "");
  const decodedUser = jwt.verify(token, "jwt-secret");
  return decodedUser.id
  }

  if(requireAuth) throw new Error('Authentication required.')

  return null //  dont return undefined as will impact prisma.query in query.js
  
};


export default getUserId;
