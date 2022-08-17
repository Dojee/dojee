function HomeView() {
  return (
    <div>
      <h1>Welcome to Doji!</h1>
      <br />
      <h2>Add a ticker and get started!</h2>
      <br />

      <h3>TODO</h3>
      <ul>
        <li>Remove ticker from nav</li>
        <li>Add datetime support to allow user to pick time periods</li>
        <li>Know when the market is closed for up-to-date functionality</li>
        <li>Refactor/Redo d3 chart... Table is very wonky</li>
        <li>Add database support (SQL)</li>
      </ul>
    </div>
  );
}

export default HomeView;
