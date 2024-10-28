import axios from 'axios'

const strapiKey = import.meta.env.VITE_STRAPI_API_TOKEN
const strapiUrl = import.meta.env.VITE_BACKEND_URL
// const strapiUrl = import.meta.env.VITE_STRAPI_URL

// const strapiUrl = 'https://strapi.macosicons.com/api/'
// const strapiUrl = 'http://localhost:1337/api/'

import localResources from '@/api/resources.json';
import homeDialogueLocal from '@/api/homeDialogue.json';

export async function getTutorials() { 
    
    let tutorials = await axios.get('https://api.macosicons.com/api/tutorials?populate=*')

    let tutorialsArr = []
    
    for(let tutorial in tutorials.data.data){       
        let image = tutorials.data.data[tutorial].attributes.feature_image
        
        if(image.data.attributes.formats){ // Set image from array to object
            tutorials.data.data[tutorial].attributes.feature_image = 'https://api.macosicons.com'+image.data.attributes.formats.medium.url
        }else{
            tutorials.data.data[tutorial].attributes.feature_image = 'https://api.macosicons.com'+image.data.attributes.url
        }
        tutorialsArr.push(tutorials.data.data[tutorial].attributes)   
    }
    
    return tutorialsArr
}

export async function getLearningHome() { 
    console.log('getLearningHome');
    
    let learningHome = await axios.get('https://api.macosicons.com/api/learn-home?populate=*')
    console.log('learningHome: ', learningHome.data.data.attributes.H3Description)
    
    return learningHome.data.data.attributes.H3Description
}

export async function getDialogHome() { 
    // let learningHome = await axios.get('https://api.macosicons.com/api/home-dialog?populate=*')
    
    return homeDialogueLocal
}

export async function getTutorialFromSlug(slug) { 
    try {
        let resource = await axios.get('https://api.macosicons.com/api/tutorials?populate=*&filters[slug][$eq]='+slug)
        resource = resource.data.data[0].attributes
        let image = resource.feature_image.data.attributes
        
        if(image.formats){ // Set image from array to object
            resource.feature_image = 'https://api.macosicons.com'+image.formats.large.url
        }else{
            resource.feature_image = 'https://api.macosicons.com'+image.url
        }
    
        return resource   
    } catch (error) {
        return {error: error}
    }
}

export async function getArticleTemplate(slug) { 
    try {
        let articleTemplate = await axios.get('https://api.macosicons.com/api/'+slug+'?populate=*')
        articleTemplate = articleTemplate.data.data.attributes
        return articleTemplate
    } catch (error) {
        return {error: error}
    }
}

export async function getStrapiData(collection) { 
    try {
        let strapiData = await fetch(`${strapiUrl}get-resources?collection=${collection}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Add this if you need to send cookies
        }).then(res => res.json())

        return strapiData
    } catch (error) {
        console.log('Error getStrapiData', error);
        return {error: error}
    }
}

export async function getResourceFromSlug(slug) {
    try {
        const resource = await fetch(`${strapiUrl}get-resources?collection=resources&slug=${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Add this if you need to send cookies
        }).then(res => res.json());

        return resource;
    } catch (error) {
        console.log('Error getResourceFromSlug', error);
        
        // If there's an error, try to find the resource in the local JSON file
        try {
            const localResource = localResources.find(resource => resource.slug === slug);
            
            if (localResource) {
                console.log('Resource found in local JSON file');
                return localResource;
            } else {
                console.log('Resource not found in local JSON file');
                return { error: error.message || 'Request failed' };
            }
        } catch (localError) {
            console.log('Error reading local resources file', localError);
            return { error: error.message || 'Request failed' };
        }
    }
}