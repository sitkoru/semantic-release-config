module.exports = {
    verifyConditions: ['@semantic-release/github'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/github'
    ],
    branches: ['+([0-9])?(.{+([0-9]),x}).x', 'master', 'main', 'next', 'next-major', { name: 'beta', prerelease: true }, { name: 'alpha', prerelease: true }]
};
