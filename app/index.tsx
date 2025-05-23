// /app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirects user to your main screen
    router.replace('/(tabs)/map');
  }, []);

  return null;
}