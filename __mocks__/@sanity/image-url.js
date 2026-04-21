// Mock for @sanity/image-url — used in Jest tests
const mockUrlBuilder = {
  width: () => mockUrlBuilder,
  height: () => mockUrlBuilder,
  url: () => 'https://cdn.sanity.io/mock-image.jpg',
}

const createImageUrlBuilder = () => ({
  image: () => mockUrlBuilder,
})

module.exports = { createImageUrlBuilder }
