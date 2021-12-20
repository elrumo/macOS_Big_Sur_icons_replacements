import axios from 'axios'

export async function getTutorials() { 
    
    let tutorials = await axios.get('https://api.macosicons.com/api/tutorials?populate=*')

    let tutorialsArr = []
    
    for(let tutorial in tutorials.data.data){       
        // Set image from array to object
        let image = tutorials.data.data[tutorial].attributes.feature_image
        tutorials.data.data[tutorial].attributes.feature_image = 'https://api.macosicons.com'+image.data.attributes.formats.medium.url    
        tutorialsArr.push(tutorials.data.data[tutorial].attributes)
    }
    
    return tutorialsArr
}

export async function getLearningHome() { 
    let learningHome = await axios.get('https://api.macosicons.com/api/home?populate=*')

    let introText = {
        h3: learningHome.data.data.attributes.title,
        description: learningHome.data.data.attributes.description,
        isAd: false,
        isCenter: true,
      }
    
    return introText
}

export async function getTutorialFromSlug(slug) { 
    try {
        let resource = await axios.get('https://api.macosicons.com/api/tutorials?populate=*&filters[slug][$eq]='+slug)
        resource = resource.data.data[0].attributes
        
        resource.feature_image = 'https://api.macosicons.com'+resource.feature_image.data.attributes.formats.medium.url    
    
        return resource   
    } catch (error) {
        return {error: error}
    }
}