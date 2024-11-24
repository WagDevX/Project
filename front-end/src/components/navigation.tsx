import logo from "../assets/logoWhite.png";

export const Navigation = () => {
  return (
    <nav className="bg-secondary flex justify-between items-center w-full rounded-b-3xl p-5 shadow-md">
      <div className="h-30">
        <img src={logo} alt="" height={100} width={150} />
      </div>
      <ul className="flex flex-col sm:flex-row gap-4">
        <li>
          <div className="px-4 sm:px-10 py-1 bg-primary text-white text-center lg:text-lg sm:text-sm  font-bold rounded-md">
            <a href="/">Buscar</a>
          </div>
        </li>
        <li>
          <div className="px-4 sm:px-10 py-1 bg-primary text-white lg:text-lg  text-center  sm:text-sm font-bold rounded-md">
            <a href="/history">Histórico</a>
          </div>
        </li>
      </ul>
    </nav>
  );
};
