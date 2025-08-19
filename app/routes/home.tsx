import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constent";
import Resumecard from "~/components/Resumecard";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback For Your Dreame Job!" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
     
     <Navbar/>

    <section className="main-section">
       <div className="page-heading">
          <h1> Track Your Application & Resume Ratings </h1>
          <h2> Review you submissons and check AI-Powered feedback. </h2>
       </div>
    </section>

    {resumes.map((resume) => (
              <Resumecard key={resume.id} resume={resume} />
          ))}
  </main>
}
