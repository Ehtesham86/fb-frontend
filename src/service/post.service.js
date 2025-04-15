import axiosInstance from "./url.service"


//create method for posts
export const createPost = async(postData) =>{
    console.log(postData,'groups_________1')

    try {
         const result = await  axiosInstance.post('/postRoute/posts', postData)
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//create method for story
export const createStory = async(postData) =>{
    try {
         const result = await  axiosInstance.post('/postRoute/story', postData)
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//get all post method 
export const getAllPosts = async() =>{
    try {
         const result = await  axiosInstance.get('/postRoute/posts')
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//get all story method 
export const getAllStory = async() =>{
    try {
         const result = await  axiosInstance.get('/postRoute/story')
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}



//method for like a post
export const likePost = async(postId) =>{
    try {
         const result = await  axiosInstance.post(`/postRoute/posts/likes/${postId}`)
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}


//method for comments a post
export const commentsPost = async(postId,comment) =>{
    try {
         const result = await  axiosInstance.post(`/postRoute/posts/comments/${postId}`,comment)
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

//method for share a post
export const sharePost = async(postId) =>{
    try {
         const result = await  axiosInstance.post(`/postRoute/posts/share/${postId}`)
         return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}


//get all users posts 
export const getAllUserPosts = async(userId)=>{
    try {
        const result = await axiosInstance.get(`/postRoute/posts/user/${userId}`)
        return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}