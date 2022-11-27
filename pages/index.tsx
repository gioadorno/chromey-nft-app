import Head from 'next/head'
import Image from 'next/image';
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { useLogout } from "@thirdweb-dev/react/solana";
import type { GetServerSideProps } from 'next';
import { getUser } from '../auth.config';
import { network } from './_app';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user)
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };

  // Check the user has the NFT and then allow access
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );
  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  //If user doesn't have CHROMEY NFT redirect to login
  if (!nft)
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    }
  };

  return {
    props: {},
  }
}

const Home = () => {
  const logout = useLogout();

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Head>
        <title>CHROMEY</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='flex items-center justify-center w-full py-5'>
        <p className='text-white text-3xl'>Members Portal</p>
      </header>
      <div className='max-w-screen-md flex justify-center items-center'>
        <button
          onClick={logout}
          className='bg-white/90 text-sky-600 py-2 px-8 border-2 border-sky-600 rounded-md hover:bg-sky-600/90 hover:text-white hover:border-white mt-10 uppercase font-bold transition duration-200'
          >
              Logout
          </button>
      </div>


      <video muted autoPlay loop src='/home-background.mp4' className='fixed -z-10 min-h-full min-w-full object-fill' />
    </div>
  )
}

export default Home;


