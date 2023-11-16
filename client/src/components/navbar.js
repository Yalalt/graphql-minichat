// Энэ компонент руу логин хийсэн хэрэглэгч болон логин хийсэн хэрэглэгчийг
// өөрчилдөг setLoggedUser функцүүдийг App компонентоос дамжуулсан байна.
function NavBar({ loggedUser, setLoggedUser }) {
  // Логин хийсэн байвал isLogged нь true болно.
  const isLogged = Boolean(loggedUser);

  // Гарах товч дээр дарахад энэ функц ажиллана
  const handleLogout = () => {
    // Browser-ийг local storage хэсгээс токеноо устгаж өгнө.
    localStorage.removeItem("chat_app_token");

    // Логин хийсэн хэрэглэгчийг state-ээсээ устгана.
    setLoggedUser(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <p className="navbar-item is-size-5 has-text-weight-bold">
          React, GraphQL Чат
        </p>
      </div>
      <div className="navbar-end">
        {isLogged && (
          <div className="navbar-item">
            <button className="button is-link" onClick={handleLogout}>
              Гарах
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
