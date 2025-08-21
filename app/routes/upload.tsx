import React, { useState, type FormEvent } from 'react'
import FileUplodaer from '~/components/FileUplodaer';
import Navbar from '~/components/Navbar'

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setstatusText] = useState('');
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

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
