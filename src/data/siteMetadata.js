const languages = require('./languages');

module.exports = {
  siteUrl: 'https://tic-tac-toe-ai.surge.sh',
  author: {
    name: 'Grimmer',
    homeCity: '',
    email: '',
    defaultLink: 'https://grimmer.netlify.com/'
  },
  sourceCodeLink: 'https://github.com/grimmer0125/tic-tac-toe-ai',
  menu: [
    {label: 'home', slug: '/'},
    {label: 'author', link: 'https://grimmer.netlify.com/'},
    {label: 'sourceCode', link: 'https://github.com/grimmer0125/tic-tac-toe-ai'}
  ],
  languages
};
