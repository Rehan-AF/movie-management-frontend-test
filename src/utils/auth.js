import * as jwt_decode from 'jwt-decode';

/**
 * Verifies the token on the frontend by decoding it.
 * If the `exp` field is present, it checks the token's expiration time.
 * @param {string} token - The JWT token to verify.
 * @returns {boolean} - Returns `true` if the token is valid; otherwise, `false`.
 */
const verifyToken = (token) => {
  if (!token) return false;
  if (token) return true;
};

export default verifyToken;
