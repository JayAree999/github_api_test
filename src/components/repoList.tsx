import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({});

async function fetchRepositories(page: number, perPage: number) {
  const response = await octokit.request("GET /repositories");

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;
  const repositories = response.data.slice(startIndex, endIndex);

  return repositories;
}

const Repositories: React.FC = () => {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function displayRepositories() {
      const fetchedRepositories = await fetchRepositories(currentPage, 10);
      setRepositories(fetchedRepositories);
    }

    displayRepositories();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      {repositories.map((repo) => (
        <div key={repo.id} className="bg-gray-100 p-4 my-2 rounded">
          <div>
            <span className="font-bold">ID: </span>
            {repo.id}
          </div>
          <div>
            <span className="font-bold">Full Name: </span>
            {repo.full_name}
          </div>
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Repositories;
