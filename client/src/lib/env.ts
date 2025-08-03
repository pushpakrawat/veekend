// Environment variables for the client
export const env = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyAdY-77pc_1gkAIKymgJuYpwm8V1qUSRvw",
  FIREBASE_API_KEY: "AIzaSyAwmL55JX1ANGdH-asfM938vmaKWCA4CMM",
  FIREBASE_AUTH_DOMAIN: "veekend-app.firebaseapp.com",
  FIREBASE_PROJECT_ID: "veekend-app",
  FIREBASE_STORAGE_BUCKET: "veekend-app.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID: "773163090837",
  FIREBASE_APP_ID: "1:773163090837:web:860bcdf9ce633b9c076c9c",
  FIREBASE_MEASUREMENT_ID: "G-CJYEPKVMMV",
} as const;
