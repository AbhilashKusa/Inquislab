module.exports = {
  Octokit: class Octokit {
    constructor() {
      this.repos = {
        getContent: jest.fn(() => Promise.resolve({ data: { sha: 'mock-sha' } })),
        createOrUpdateFileContents: jest.fn(() => Promise.resolve({})),
      };
    }
  },
};
