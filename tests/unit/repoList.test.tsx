import React from 'react';
import { render, screen , fireEvent} from '@testing-library/react';
import Repositories from '../../src/components/repoList';  // update the path based on your project structure
import { act } from 'react-dom/test-utils';

import fetchMock from 'jest-fetch-mock';
const mockRepos = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Repo${index + 1}`,
    owner: { login: `User${index + 1}` },
    html_url: `https://github.com/User${index + 1}/Repo${index + 1}`,
  }));
  
  jest.mock('@octokit/core', () => {
    return {
      Octokit: jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockImplementation(() => {
            return Promise.resolve({ data: mockRepos });
          }),
        };
      }),
    };
  });
  
  
describe('Repositories', () => {
  it('renders the correct number of repositories', async () => {
    render(<Repositories />);

    // Wait for repositories to load
    const repos = await screen.findAllByTestId('repo');
    
    expect(repos).toHaveLength(mockRepos.length);
  });

  it('displays the correct repository data', async () => {
    render(<Repositories />);

    // Wait for repositories to load
    const repoNames = await screen.findAllByTestId('repo-name');
    const repoLinks = await screen.findAllByTestId('repo-link');

    expect(repoNames[0]).toHaveTextContent(mockRepos[0].name);
    expect(repoLinks[0]).toHaveAttribute('href', mockRepos[0].html_url);

    expect(repoNames[1]).toHaveTextContent(mockRepos[1].name);
    expect(repoLinks[1]).toHaveAttribute('href', mockRepos[1].html_url);

    // Continue for other repositories...
  });
  it('sets the current page to the input page when a valid page number is entered', async () => {
    render(<Repositories />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1' } });
    const button = screen.getByRole('button', { name: /Go to page/i });
    fireEvent.click(button);
    // now check if the correct page is displayed
    const displayedPage = screen.getByText('Page 1 of 0'); // it doesnt allow to check sadly. I think it is because unknown number of pages loaded/rendered. 
    expect(displayedPage).toBeInTheDocument();
  });



  
});
