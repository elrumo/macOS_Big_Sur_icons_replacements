import GhostContentAPI from "@tryghost/content-api"

const api = new GhostContentAPI({
    url: 'https://onionicons.com/blog',
    key: '1fd32b6e7eb72918e7e63a3719',
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