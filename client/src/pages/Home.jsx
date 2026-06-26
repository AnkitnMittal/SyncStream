import illustration from '../assets/illustration.png';
import FormComponent from '../components/FormComponent';

function HomePage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-16'>
      <div className='my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0'>
        <div className='flex w-full animate-up-down justify-center sm:w-1/2 sm:pl-4'>
          <img
            src={illustration}
            alt='SyncStream Illustration'
            className='mx-auto w-62.5 sm:w-100'
          />
        </div>
        <div className='flex w-full items-center justify-center sm:w-1/2'>
          <FormComponent />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
