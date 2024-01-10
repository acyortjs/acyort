/**
 * @type {import('@acyort/pigeon').Config}
 */
const config = {
  plugins: ['@acyort/pigeon'],
  template: '@acyort/pigeon',
  repository: 'LoeiFy/Recordum',
  title: 'Pigeon',
  description: 'Why is the pigeon so big',
  public: '/docs',
  menu: {
    archives: '/archives/',
    categories: '/categories/',
    tags: '/tags/',
    about: '/about/',
  },
  favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAGFBMVEUAAAA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozsmr7C1AAAAB3RSTlMA8o3HRiCjAZ7XVAAAAFRJREFUKM9jGAUMDE6GwiroYkHi5eWFqqhirOnlQFAWgCLIVA4GCiiCjhBBERRBdYhgEYqgOUSwGEVQHCJYSEgQoZ2QRQgnEXI8wpsEAgQRdKOAAQCvriuz6lBMNwAAAABJRU5ErkJggg==',
  timezone: 'Asia/Shanghai',
  language: 'en',
  perpage: 5,
}

module.exports = config
