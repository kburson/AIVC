import Conversation from '../components/Conversation';
export default function Page() {
  return (
    <div className="page-shell">
      <header className="reference-header">
        <h1>Voice BFF reference</h1>
        <p>
          A browser application and an independent synthetic project catalog
          demonstrate the HTTP retrieval boundary.
        </p>
      </header>
      <Conversation />
    </div>
  );
}
