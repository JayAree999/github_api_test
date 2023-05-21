import React from "react";
import Repositories from "../components/repoList";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Public Repositories</h1>
      <Repositories />
    </div>
  );
};

export default HomePage;
