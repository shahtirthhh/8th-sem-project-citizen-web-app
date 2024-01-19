import React from "react";

function Header() {
  return (
    <div className="w-full h-24 p-1  bg-gradient-to-r from-cyan-400 via-white to-cyan-400 flex flex-row justify-center">
      <div className="flex flex-col my-1 gap-1">
        <span className="font-serif text-4xl tracking-wider uppercase font-semibold">
          Reporting and Resolution Portal
        </span>
        <span className="font-sans text-md font-semibold uppercase text-center tracking-wider">
          A gateway between citizens and collector of Rajkot
        </span>
      </div>
    </div>
  );
}

export default Header;
