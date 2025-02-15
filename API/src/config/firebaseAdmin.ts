import admin from "firebase-admin";
import serviceAccount from "./fb_sdk_key.json"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;