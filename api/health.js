"use strict";
module.exports=function(req,res){
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json({ok:true,mode:process.env.OPENAI_API_KEY?"ai-ready":"demo",fictionalCompaniesOnly:true});
};
