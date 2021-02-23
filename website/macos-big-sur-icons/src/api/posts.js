import GhostContentAPI from "@tryghost/content-api"

const api = new GhostContentAPI({
    url: 'https://onionicons.com/blog/',
    key: 'dc182528d2e8d5e9bc0051918c',
    version: "v3"
  });
  
export async function getPosts() {
    return await api.posts.browse({
            limit: "all"
        })
    .catch(err => {
        console.error(err);
    });
}