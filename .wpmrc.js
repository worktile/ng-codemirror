module.exports = {
  allowBranch: ["master", "12.*", "13.*"],
  bumpFiles: ["package.json", "package-lock.json", "src/package.json"],
  skip: {
    branch: true
  },
  hooks: {
    prerelease: "npm run build",
    prepublish: "npm run build",
  },
};
