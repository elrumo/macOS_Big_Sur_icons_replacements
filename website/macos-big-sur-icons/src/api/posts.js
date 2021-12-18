import GhostContentAPI from "@tryghost/content-api"

// TODO: Remove API Key
const VITE_GHOST_KEY =import.meta.env.VITE_GHOST_KEY

const api = new GhostContentAPI({
    url: 'https://blog.macosicons.com/blog',
    key: VITE_GHOST_KEY,
    version: "v3"
});

export async function getPosts() { 
    let posts = api.posts.browse({order: 'published_at DESC'})
    
    return await posts
    .catch(err => {
        console.error("err: ", err);
    });
}

export async function getBlogPost(postSlug) {
    return await api.posts.read({slug: postSlug}, {formats: ['html']})
    .catch(err => {
        console.error("err: ", err);
    });
}

export async function getPages(n) { 
    let pages = await api.pages.browse({limit: n, order: 'published_at DESC'});
    
    // Check if page is featured and place it at the front
    pages.forEach(async page => {
        if (page.featured) {
            pages.splice(pages.indexOf(page), 1)
            pages.unshift(page)
        }
    })
    
    return pages
}

export async function getSinglePage(resourceSlug) { 
    let page = api.pages.read({slug: resourceSlug});

    return await page
    .catch(err => {
        console.error("err: ", err);
    });
}