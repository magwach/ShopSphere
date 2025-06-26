import { useEffect } from "react";
import { useUserStore } from "../stores/user.store";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

  return (
    <div>
      <h1>Welcome to the Home </h1>
      <p>This is the main page of our application.</p>
    </div>
  );
}
