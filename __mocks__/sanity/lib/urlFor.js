// Mock for sanity/lib/urlFor — used in Jest tests to avoid Sanity env vars
const mockUrlBuilder = {
  width: () => mockUrlBuilder,
  height: () => mockUrlBuilder,
  url: () => 'https://cdn.sanity.io/mock-image.jpg',
}

module.exports = {
  urlFor: () => mockUrlBuilder,
}
