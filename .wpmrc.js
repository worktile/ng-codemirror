module.exports = {
  allowBranch: ["master", "12.*", "13.*"],
  bumpFiles: ["package.json", "package-lock.json", "src/package.json"],
  hooks: {
    prerelease: "npm run build",
    prepublish: "npm run build",
  },
};
