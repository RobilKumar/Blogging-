const blogDatValidate = ({title,textBody})=>{
    return new Promise((resolve,reject)=>{
        if(!title || !textBody) return ("Missing data");

        if(typeof title!=="string") reject("title is not a text");
        if(typeof textBody!=="string") reject("textBody is not a text");

        resolve();
    })
}

module.exports={blogDatValidate};