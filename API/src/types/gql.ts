import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export type GqlContext = Promise<DecodedIdToken | null>