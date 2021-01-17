const GenerateMessages=(username,text)=>{
     return {
         username:username,
        text,
        time:new Date().getTime()
     }
  
}

module.exports={
    GenerateMessages
}