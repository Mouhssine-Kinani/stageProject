import { redirect } from "next/navigation";

export default function Home() {
  redirect("/home"); // Redirect root to /home
  return null; // This component won't render
}
