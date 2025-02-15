import admin from "../config/firebaseAdmin";
import { GqlContext } from "../types/gql";

const createContext = async ({ request }: { request: Request }): GqlContext => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split("Bearer ")[1];
  if (!token) return null;

  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .catch(() => null);

  return decodedToken || null;
};

export default createContext;
