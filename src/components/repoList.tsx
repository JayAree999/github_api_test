import React, { useEffect, useState } from 'react';
import { Octokit } from "@octokit/core";
import styles from '../../styles/repoList.module.css';

interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
}

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_TOKEN,
});

const ReposList: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [inputPage, setInputPage] = useState("");
  const reposPerPage = 10;
  const pagesToLoad = 10;

  useEffect(() => {
    fetchRepos(0);
  }, []);

  const fetchRepos = async (since: number) => {
    try {
      let currentSince = since;
      for (let i = 0; i < pagesToLoad; i++) {
        const response = await octokit.request('GET /repositories', {
          since: currentSince,
        });
        if (response.data.length > 0) {
          setRepos(repos => [...repos, ...response.data.slice(0, reposPerPage)]);
          currentSince = response.data[response.data.length - 1].id;
        }
      }
    } catch (error) {
      console.error('Error getting repos:', error);
    }
  };

  const totalPages = Math.ceil(repos.length / reposPerPage);
  const reposToDisplay = repos.slice(currentPage * reposPerPage, (currentPage + 1) * reposPerPage);

  const gotoPage = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page - 1);
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Public Repositories</h1>
      <div className={styles.inputContainer}>
        <input type="text" value={inputPage} onChange={(e) => setInputPage(e.target.value)} className={styles.input} />
        <button onClick={gotoPage} className={styles.button}>Go to page</button>
      </div>
      <p>Page {currentPage + 1} of {totalPages}</p>
      <div className={styles.reposContainer}>
        {reposToDisplay.map((repo: Repo, index: number) => (
          <div key={repo.id} className={styles.repo}>
            <p className={styles.repoName}>{index + 1}. {repo.name}</p>
            <p className={styles.owner}>by {repo.owner.login}</p>
            <p><a href={repo.html_url} target="_blank" rel="noreferrer" className={styles.link}>{repo.html_url}</a></p>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0} className={styles.button}>
          Prev
        </button>
        <button onClick={() => {
          setCurrentPage(currentPage + 1);
          if ((currentPage + 1) * reposPerPage >= repos.length) {
            fetchRepos(repos[repos.length - 1].id);
          }
        }} className={styles.button}>
          Next
        </button>
      </div>
    </div>
  );
    }  

export default ReposList;
