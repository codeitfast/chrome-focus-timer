export default function findCategory(categories, url) {
    const foundCategory = Object.keys(categories).find(key => categories[key].urls.includes(url));
    return foundCategory? foundCategory : 'other'
}