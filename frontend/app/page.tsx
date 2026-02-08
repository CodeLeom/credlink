export default function HomePage() {
  return (
    <div style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1>CredLink</h1>
      <p>Go to the user or admin portal.</p>
      <ul>
        <li>
          <a href="/user">User Portal</a>
        </li>
        <li>
          <a href="/admin">Admin Portal</a>
        </li>
      </ul>
    </div>
  );
}
