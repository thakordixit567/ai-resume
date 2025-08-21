import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constent";
import Resumecard from "~/components/Resumecard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback For Your Dreame Job!" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  
  const navigate = useNavigate();

  useEffect( () => {
      if(!auth.isAuthenticated) navigate('/auth?next=/');
  },[auth.isAuthenticated])
  
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
     
     <Navbar/>

    <section className="main-section">
       <div className="page-heading py-16">
          <h1> Track Your Application & Resume Ratings </h1>
          <h2> Review you submissons and check AI-Powered feedback. </h2>
       </div>
       
    {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <Resumecard key={resume.id} resume={resume} />
          ))}
    </div>
    )}
    </section>


  

    
  </main>
}
