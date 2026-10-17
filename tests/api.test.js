"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const handler=require("../api/interview.js");
function mock(method,body){
  let status=200,headers={},result;
  const res={setHeader(k,v){headers[k]=v;return res;},status(s){status=s;return res;},json(data){result=data;return res;}};
  return {req:{method,body},res,read:()=>({status,headers,result})};
}
test("GET is rejected",async()=>{
  const x=mock("GET");await handler(x.req,x.res);
  assert.equal(x.read().status,405);
});
test("missing input is rejected",async()=>{
  const x=mock("POST");await handler(x.req,x.res);
  assert.equal(x.read().status,400);
});
test("without API key, demo fallback is explicit",async()=>{
  const key=process.env.OPENAI_API_KEY;delete process.env.OPENAI_API_KEY;
  try{const x=mock("POST",{job:"AIエンジニア",salary:800,style:"リモート重視"});
  await handler(x.req,x.res);assert.equal(x.read().status,503);assert.equal(x.read().result.mode,"demo");
  }finally{if(key)process.env.OPENAI_API_KEY=key;}
});
