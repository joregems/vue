import{_ as u,r as p,c as r,w as o,y as m,b as s,A as d,V as i,d as c,q as f,v as _,o as V,J as b}from"./index-30906700.js";const g={__name:"ImageUpload",setup(v){const t=p(void 0);async function l(){const a=new FormData;a.append("image",t.value[0]),b.post("uploadtest",a).then(e=>{alert(e.data)}).catch(e=>{console.log(e.response)})}return(a,e)=>(V(),r(m,{width:"300",class:"mx-auto"},{default:o(()=>[s(_,{enctype:"multipart/form-data",onSubmit:e[1]||(e[1]=f(()=>{l()},["prevent"]))},{default:o(()=>[s(d,{label:a.key,type:"file",modelValue:t.value,"onUpdate:modelValue":e[0]||(e[0]=n=>t.value=n),"truncate-length":"15"},null,8,["label","modelValue"]),s(i,{type:"submit",block:"",class:"mt-2"},{default:o(()=>[c("submit")]),_:1})]),_:1})]),_:1}))}},y=u(g,[["__file","/app/src/components/ImageUpload.vue"]]);export{y as default};
