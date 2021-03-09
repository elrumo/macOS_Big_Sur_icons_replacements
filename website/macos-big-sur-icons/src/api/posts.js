import GhostContentAPI from "@tryghost/content-api"

// TODO: Remove API Key

const VUE_APP_GHOST_KEY = process.env.VUE_APP_GHOST_KEY

const api = new GhostContentAPI({
    url: 'https://onionicons.com/blog',
    key: VUE_APP_GHOST_KEY,
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
    let pages = api.pages.browse({limit: n, order: 'published_at DESC'});
    // console.log(await pages);
    return await pages
    .catch(err => {
        console.error("err: ", err);
    });
}

export async function getSinglePage(resourceSlug) { 
    let page = api.pages.read({slug: resourceSlug});

    return await page
    .catch(err => {
        console.error("err: ", err);
    });
}