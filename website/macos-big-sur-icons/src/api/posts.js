import GhostContentAPI from "@tryghost/content-api"

const VUE_APP_GHOST_KEY = process.env.VUE_APP_GHOST_KEY

console.log(VUE_APP_GHOST_KEY);

const api = new GhostContentAPI({
    url: 'https://onionicons.com/blog',
    key: VUE_APP_GHOST_KEY,
    version: "v3"
});

export async function getPosts() { 
    let posts = api.posts.browse({})
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