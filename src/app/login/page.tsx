import Link from "next/link";

export default function Login() {
  return (
    <div>
      <form>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Enter Email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="Enter Password" />
        </div>
        <button type="button">Login</button>
      </form>
      <p>
        Vous n&apos;avez pas de compte ?{" "}
        <Link href="/register">Sign up now</Link>
      </p>
    </div>
    
  );
}
