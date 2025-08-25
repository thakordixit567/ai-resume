import { prepareInstructions } from 'constent';
import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUplodaer from '~/components/FileUplodaer';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

const upload = () => {
  const { auth, isLoading,fs, ai, kv } = usePuterStore();  
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setstatusText] = useState('');
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file} : { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
    setIsProcessing(true);
    setstatusText('Uploading the file...');

    const uploadFile = await fs.upload([file]);
    if(!uploadFile) return setstatusText('Error: Failed to upload file');

    setstatusText('Converting to image....');
    const imageFile = await convertPdfToImage(file);
    if(!imageFile.file) return setstatusText('Error: Failed to convert PDF to image');

    setstatusText('Uploading the image....');
    const uploadedImage = await fs.upload([imageFile.file]);
    if(!uploadedImage) return setstatusText('Error: Failed to upload image');

    setstatusText('Preparing Data....');

    const uuid = generateUUID();
    const data = {
        id: uuid,
        resumePath: uploadFile.path,
        imagePath: uploadedImage.path,
        companyName,jobTitle,jobDescription,
        feedback: '',

    }
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setstatusText('Analyzing....');
    const feedback = await ai.feedback(
        uploadFile.path,
        prepareInstructions({ jobTitle, jobDescription }),
    )
    if (!feedback) return setstatusText('Error: Failed to analyze resume');
    const feedbackText = typeof feedback.message.content === 'string'
    ? feedback.message.content
    : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setstatusText('Analysis complete, redirecting....');
    console.log(data);

  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if(!form) return;
      const formData = new FormData(form);

      const companyName = formData.get('company-name') as string;
      const jobTitle = formData.get('job-title') as string;
      const jobDescription = formData.get('job-description') as string;

      if(!file) return;

      handleAnalyze({ companyName, jobTitle, jobDescription, file});
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
     
     <Navbar/>

    <section className="main-section">
        <div className='page-heading'>
            <h1>Smart feedback for your dream job</h1>
            {
                isProcessing ? (
                    <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className='w-full' />
                    </>
                ) : (
                    <h2>Drop your resume  for an ATS score improvement tips</h2>
                )
            }
            {
                !isProcessing && (
                    <form id="upload-form" onSubmit={handleSubmit}
                    className='flex flex-col gap-4 mt-8'
                    >
                      <div className='form-div'>
                          <label htmlFor='company-name' className='font-bold'>
                              Company Name
                          </label>
                          <input type='text' name='company-name' placeholder='Company Name' id='company-name'/>
                      </div>
                      <div className='form-div'>
                          <label htmlFor='job-title' className='font-bold'>
                              Job Title
                          </label>
                          <input type='text' name='job-title' placeholder='Job Title' id='job-title'/>
                      </div>
                      <div className='form-div'>
                          <label htmlFor='description' className='font-bold'>
                              Description
                          </label>
                          <textarea rows={5} name='description' placeholder='Please Add Some Description.......' id='description'/>
                      </div>
                      <div className='form-div'>
                          <label htmlFor='uploader' className='font-bold'>
                              Upload Resume
                          </label>
                          <FileUplodaer onFileSelect={handleFileSelect}/>
                      </div>

                      <button className='primary-button' type='submit'>
                            Analyze Resume
                      </button>
                    </form>
                )
            }
        </div>
    </section>
    </main>
  )
}

export default upload
