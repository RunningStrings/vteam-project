function Header() {
    return (
      <div className="flex justify-between bg-yellow-500 p-8">
        <h1 className="text-4xl uppercase">HeaderText</h1>
        <input
          className="w-36 rounded-full bg-red-50 px-4 py-2 transition-all focus:w-60"
          placeholder="Search.."
        />
      </div>
    );
  }
  
  export default Header;