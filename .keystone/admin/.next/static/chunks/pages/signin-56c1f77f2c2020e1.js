(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[176],{5013:function(t,e,i){"use strict";i.d(e,{S:function(){return a}});var n=i(5445);const a=t=>{let{children:e,title:i}=t;const{colors:a,shadow:r}=(0,n.Fg)();return(0,n.tZ)("div",null,(0,n.tZ)("head",null,(0,n.tZ)("title",null,i||"Keystone")),(0,n.tZ)(n.M5,{css:{minWidth:"100vw",minHeight:"100vh",backgroundColor:a.backgroundMuted},rounding:"medium"},(0,n.tZ)(n.xu,{css:{background:a.background,width:600,boxShadow:r.s100},margin:"medium",padding:"xlarge",rounding:"medium"},e)))}},6551:function(t,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signin",function(){return i(6119)}])},6119:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return f}});var n=i(3028),a=i(2784),r=i(5445),s=i(5631),o=i(4944),u=i(3900),d=i(81),l=i(2225),c=i(5703),g=i(1511),m=i(6759),h=i(5013);const v=t=>{var e,i;let{identityField:v,secretField:p,mutationName:f,successTypename:y,failureTypename:Z}=t;const w=d.Ps`
    mutation($identity: String!, $secret: String!) {
      authenticate: ${f}(${v}: $identity, ${p}: $secret) {
        ... on ${y} {
          item {
            id
          }
        }
        ... on ${Z} {
          message
        }
      }
    }
  `,[_,b]=(0,a.useState)("signin"),[S,k]=(0,a.useState)({identity:"",secret:""}),E=(0,a.useRef)(null);(0,a.useEffect)((()=>{var t;null===(t=E.current)||void 0===t||t.focus()}),[_]);const[F,{error:$,loading:q,data:x}]=(0,l.D)(w),T=(0,c.Mz)(),N=(0,g.tv)(),C=(0,c.gS)();return(0,a.useEffect)((()=>{"authenticated"===C.authenticatedItem.state&&N.push(N.query.from||"/")}),[C.authenticatedItem,N]),"authenticated"===C.authenticatedItem.state?(0,r.tZ)(r.M5,{fillView:!0},(0,r.tZ)(m.xg,{label:"Loading page",size:"large"})):(0,r.tZ)(h.S,{title:"Keystone - Sign In"},(0,r.tZ)(r.Kq,{gap:"xlarge",as:"form",onSubmit:async t=>{if(t.preventDefault(),"signin"===_){try{var e;if((null===(e=(await F({variables:{identity:S.identity,secret:S.secret}})).data.authenticate)||void 0===e?void 0:e.__typename)!==y)return}catch(i){return}T(),N.push(N.query.from||"/")}}},(0,r.tZ)(r.H1,null,"Sign In"),$&&(0,r.tZ)(u.qX,{title:"Error",tone:"negative"},$.message),(null===x||void 0===x||null===(e=x.authenticate)||void 0===e?void 0:e.__typename)===Z&&(0,r.tZ)(u.qX,{title:"Error",tone:"negative"},null===x||void 0===x?void 0:x.authenticate.message),(0,r.tZ)(r.Kq,{gap:"medium"},(0,r.tZ)(r.TX,{as:"label",htmlFor:"identity"},v),(0,r.tZ)(o.oi,{id:"identity",name:"identity",value:S.identity,onChange:t=>k((0,n.Z)((0,n.Z)({},S),{},{identity:t.target.value})),placeholder:v,ref:E}),"signin"===_&&(0,r.tZ)(a.Fragment,null,(0,r.tZ)(r.TX,{as:"label",htmlFor:"password"},p),(0,r.tZ)(o.oi,{id:"password",name:"password",value:S.secret,onChange:t=>k((0,n.Z)((0,n.Z)({},S),{},{secret:t.target.value})),placeholder:p,type:"password"}))),"forgot password"===_?(0,r.tZ)(r.Kq,{gap:"medium",across:!0},(0,r.tZ)(s.zx,{type:"submit",weight:"bold",tone:"active"},"Log reset link"),(0,r.tZ)(s.zx,{weight:"none",tone:"active",onClick:()=>b("signin")},"Go back")):(0,r.tZ)(r.Kq,{gap:"medium",across:!0},(0,r.tZ)(s.zx,{weight:"bold",tone:"active",isLoading:q||(null===x||void 0===x||null===(i=x.authenticate)||void 0===i?void 0:i.__typename)===y,type:"submit"},"Sign In"))))};var p,f=(p={identityField:"email",secretField:"password",mutationName:"authenticateUserWithPassword",successTypename:"UserAuthenticationWithPasswordSuccess",failureTypename:"UserAuthenticationWithPasswordFailure"},()=>(0,r.tZ)(v,p))}},function(t){t.O(0,[888,774,179],(function(){return e=6551,t(t.s=e);var e}));var e=t.O();_N_E=e}]);