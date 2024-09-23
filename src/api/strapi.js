import axios from 'axios'

const strapiKey = import.meta.env.VITE_STRAPI_API_TOKEN
const strapiUrl = import.meta.env.VITE_STRAPI_URL
console.log("strapiUrl: ", strapiUrl);
// const strapiUrl = 'https://strapi.macosicons.com/api/'
// const strapiUrl = 'http://localhost:1337/api/'

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
    let learningHome = await axios.get('https://api.macosicons.com/api/learn-home?populate=*')
    console.log('learningHome: ', learningHome.data.data.attributes.H3Description)
    
    return learningHome.data.data.attributes.H3Description
}

export async function getDialogHome() { 
    let learningHome = await axios.get('https://api.macosicons.com/api/home-dialog?populate=*')
    
    return learningHome.data.data.attributes
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

export async function getStrapiData(slug) { 
    try {
        let strapiData = await axios.get(`${strapiUrl}${slug}?populate=*`, {
          headers: {
            Authorization: `Bearer ${strapiKey}`
            // Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
          }
        })
        // let strapiData = await axios.get('https://api.macosicons.com/api/'+slug+'?populate=*')
        strapiData = strapiData.data.data
        console.log("strapiData: ", strapiData);

        // let newArr = strapiData.map(el =>{
        //     el = el.attributes
            
        //     if(el.feature_image.data.attributes.formats){
        //         el.feature_image = strapiData+el.feature_image.data.attributes.formats.small.url
        //     } else {
        //         el.feature_image = strapiData+el.feature_image.data.attributes.url
        //     }

        //     return el
        // })

        return strapiData
    } catch (error) {
        return {error: error}
    }
}

export async function getResourceFromSlug(slug) { 
    try {
        let resource = await axios.get(strapiUrl+'resources?populate=*&filters[slug][$eq]='+slug,{
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`
              }
        })
        // let resource = await axios.get('https://api.macosicons.com/api/resources?populate=*&filters[slug][$eq]='+slug)
        resource = resource.data.data[0]
        console.log("resource: ", resource);
        // let image = resource.feature_image.data.attributes
        
        // if(image.formats){ // Set image from array to object
        //     resource.feature_image = 'https://api.macosicons.com'+image.formats.large.url
        // }else{
        //     resource.feature_image = 'https://api.macosicons.com'+image.url
        // }
    
        return resource   
    } catch (error) {
        console.log('Error getResourceFromSlug', error);
        return {error: error}
    }
}