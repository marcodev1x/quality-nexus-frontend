import useUser from "../hooks/useUser.ts";
import FirstTopContainer from "../components/FirstTopContainer.tsx";
import ComponentButton from "../components/Button.tsx";

const PlanUser = () => {
   const user = useUser();
   const returnNamedPlan = () => {
    if(user?.role === 'free')  return user?.role[0].toUpperCase() + user?.role.slice(1).toLowerCase();

    if(user?.role === 'plan') return 'Pago'

    else return "Unknown User";
   }
   return (

       <FirstTopContainer>
           <div style={{display: "flex", justifyContent: "space-between", flexDirection: 'column', gap: '12px'}}>
               <div>
                   <h1>Plano atual: {returnNamedPlan()}</h1>
               </div>
               <div>
                   {returnNamedPlan() === 'Free' && (
                       <div>
                           <h3 style={{fontWeight: 'normal', color: "#232"}}>Você está no plano gratuito, considere fazer um upgrade para o plano premium</h3>
                           <ComponentButton >A</ComponentButton>
                       </div>
                   )}
                     {returnNamedPlan() === 'Pago' && (
                          <div>
                            <h3 style={{fontWeight: 'normal', color: "#232"}}>Você está no plano premium, aproveite seus benefícios e comece a testar!</h3>
                          </div>
                     )}
               </div>
           </div>
       </FirstTopContainer>
   )
}
export default PlanUser
