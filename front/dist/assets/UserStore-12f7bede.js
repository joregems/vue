import{l as p,r as u,n as a}from"./index-30906700.js";const m={email:{type:"text",icon:"mdi-email",label:"email"},password:{type:"password",icon:"mdi-key",label:"password"},name:{type:"text",icon:"mdi-face-man",label:"name"},role:{type:"options",icon:"",items:["admin","user"],label:"rol"}},f=p("userStore",()=>{const n=u([]),o=u({});async function r(){const e=await a.get("users");return n.value=e.data,e.data}function i(){return JSON.parse(JSON.stringify(m))}function c(e){o.value=e}async function l(e){const s="users/"+e.uuid;return a.put(s,e).then(async t=>(await r(),t),t=>{throw t})}async function d(e){const s="users/"+e.uuid;return a.delete(s,e).then(async t=>(await r(),t),t=>{throw t})}return{user:o,users:n,$get_adapter:i,$set_user:c,$get_users:r,$delete:d,$update:l}});export{f as a,m as u};
