import GhostContentAPI from "@tryghost/content-api"

const api = new GhostContentAPI({
    url: 'https://onionicons.com/blog',
    key: '1fd32b6e7eb72918e7e63a3719',
    version: "v3"
  });
  
export async function getPosts() {
    console.log(await api.posts.browse({page: 1}));
    return await api.posts.browse({})
    .catch(err => {
        console.error(err);
    });
}

export async function getBlogPost(postSlug) {
    console.log(await api.posts.read({slug: postSlug}, {formats: ['html', 'plaintext']}));
    return await api.posts.read({slug: postSlug}, {formats: ['html', 'plaintext']})
    .catch(err => {
        console.error(err);
    });
}