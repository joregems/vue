import{_ as j,r as v,p as S,c as x,w as b,b as d,h as p,i as B,e as a,F as U,V as w,d as _,t as f,q as y,v as N,x as O,y as G,o as i,z as A,A as E,B as M}from"./index-30906700.js";const T={key:0},$={key:1},q={key:2},z={inheritAttrs:!1},C=Object.assign(z,{__name:"GenericForm",props:{obj:Object,submitName:String,adapter:Object,submit:Function,errors:Array,callback:Function},setup(V){const o=v([]),u=V,l=v({}),t=u.adapter,h=u.submitName??"Submit",g=(r,n)=>r.filter(e=>n.includes(e));S(()=>{l.value={...u.obj}});async function F(r,n){const e=s=>{const m={};return s.forEach(c=>{try{m[c.path].push(c.message)}catch{m[c.path]=[c.message]}}),m};u.submit(r).then(s=>{o.value=["updated sucessfully"];try{n(),u.callback()}catch{}},s=>{console.log(s),o.value=[];try{o.value=e(s.response.data.errors)}catch{try{o.value=e(s.response.data)}catch{}}})}return(r,n)=>(i(),x(G,{width:"300",class:"mx-auto"},{default:b(()=>[d(N,{enctype:"multipart/form-data",onSubmit:n[0]||(n[0]=y(()=>{F(l.value,()=>r.$emit("close"))},["prevent"]))},{default:b(()=>[(i(!0),p(U,null,B(g(Object.keys(l.value),Object.keys(a(t))),e=>(i(),p("div",null,[a(t)[e].type=="options"?(i(),p("div",T,[d(A,{type:a(t)[e].type,variant:"solo","prepend-inner-icon":a(t)[e].icon,modelValue:l.value[e],"onUpdate:modelValue":s=>l.value[e]=s,disabled:a(t)[e].disabled,label:a(t)[e].label,items:a(t)[e].items,"error-messages":o.value[e]},null,8,["type","prepend-inner-icon","modelValue","onUpdate:modelValue","disabled","label","items","error-messages"])])):a(t)[e].type=="file"?(i(),p("div",$,[d(E,{type:"file",label:a(t)[e].label,modelValue:l.value[e],"onUpdate:modelValue":s=>l.value[e]=s,"truncate-length":"15"},{default:b(()=>[_(f(e),1)]),_:2},1032,["label","modelValue","onUpdate:modelValue"])])):(i(),p("div",q,[d(M,{type:a(t)[e].type,variant:"solo","prepend-inner-icon":a(t)[e].icon,modelValue:l.value[e],"onUpdate:modelValue":s=>l.value[e]=s,disabled:a(t)[e].disabled,label:a(t)[e].label,"error-messages":o.value[e]},null,8,["type","prepend-inner-icon","modelValue","onUpdate:modelValue","disabled","label","error-messages"])]))]))),256)),d(w,{type:"submit",block:"",class:"mt-2"},{default:b(()=>[_(f(a(h)),1)]),_:1})]),_:1}),O(r.$slots,"down")]),_:3}))}}),I=j(C,[["__file","/app/src/components/GenericForm.vue"]]);export{I as G};
