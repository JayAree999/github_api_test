import axios from "axios";

const fetchPublicRepos = async () => {
  try {
    const response = await axios.get("https://api.github.com/repositories", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer <YOUR-TOKEN>",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching public repositories:", error);
    return [];
  }
};

// Example usage
fetchPublicRepos()
  .then((repos) => {
    console.log(repos);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
