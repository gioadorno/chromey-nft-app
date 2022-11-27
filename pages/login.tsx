import React, { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import {
    useClaimNFT,
    useLogin,
    useLogout,
    useProgram,
    useUser,
    useDropUnclaimedSupply,
    useNFTs,
} from "@thirdweb-dev/react/solana";
import { wallet } from './_app';
import { useRouter } from 'next/router';
import { NFT } from "@thirdweb-dev/sdk";
import Link from 'next/link';
import Image from 'next/image';

const Login = () => {
    const [usersNft, setUsersNft] = useState<NFT | undefined>();

    const login = useLogin();
    const logout = useLogout();
    const router = useRouter();
    const { user } = useUser();
    const { publicKey, connect, select } = useWallet();

    const { program } = useProgram(
        process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
        'nft-drop'
        );

        const { data: uncalimedSupply } = useDropUnclaimedSupply(program);
        const { data: nfts, isLoading } = useNFTs(program);
        const { mutateAsync: claim } = useClaimNFT(program);

        // Check if user has a public key, if not that select their wallet
        useEffect(() => {
            if (!publicKey) {
                select(wallet.name);
                connect();
            }
        }, [publicKey, wallet]);

        // Gets users logged in address
        useEffect(() => {
            if (!user || !nfts) return;

            const usersNft = nfts.find((nft) => nft.owner === user?.address);

            if (usersNft) {
                setUsersNft(usersNft);
            }
        }, [nfts, user]);

        const handleLogin = async () => {
            await login();
            router.replace('/');
        };

        const handlePurchase = async () => {
            await claim({
                amount: 1,
            });
            router.replace('/');
        };
    

  return (
    <div className='flex relative min-h-screen flex-col items-center justify-center text-center'>
        <Image 
        className='mt-5 z-30 shadow-2xl mb-10 rounded-full object-cover'
        src='/logo.jpg'
        alt='logo'
        width={400}
        height={400}
        />

        <main className='z-30 text-white pt-5'>
            <h1 className='text-4xl font-bold uppercase'>
                Welcome to <span className='text-sky-300 hover:scale-105 hover:text-teal-300 duration-200 ease-in transform hover:animate-pulse cursor-pointer'>CHROMEY</span>
            </h1>

            {!user && (
                <div>
                    <button
                    onClick={handleLogin}
                    className='text-2xl font-bold mb-5 bg-sky-600 text-white py-4 px-10 border-2 border-teal-400 animate-pulse rounded-md transition duration-200 mt-5 hover:text-black hover:bg-sky-400' 
                    >
                        Login / Connect Wallet
                    </button>
                </div>
            )}

            {user && (
                <div>
                    <p className='text-lg text-sky-300 font-bold mb-10'>
                        Hello there {user.address.slice(0,5)}...{user.address.slice(-5)}
                    </p>

                    {isLoading && (
                        <div className='text-2xl font-bold mb-5 bg-sky-600 text-white py-4 px-10 border-2 border-teal-400 animate-pulse rounded-md transition duration-200'>
                            Please hold, we're just looking for your CHROMEY Membership...
                        </div>
                    )}

                    {usersNft && (
                        <div className='text-2xl font-bold mb-5 bg-sky-600 text-white py-4 px-10 border-2 border-teal-400 animate-pulse rounded-md transition duration-200 hover:bg-sky-300 hover:text-black mt-5 uppercase'>
                            <Link
                            href='/'

                            >
                                ACCESS GRANTED - ENTER
                            </Link>

                        </div>
                    )}

                    {!usersNft &&
                    !isLoading &&
                    (uncalimedSupply && uncalimedSupply > 0 ? (
                        <button
                        onClick={handlePurchase}
                        className='bg-sky-600 text-white py-4 px-10 border-2 border-teal-400 rounded-md hover:bg-white hover:text-sky-600 mt-5 uppercase font-bold transition duration-200'
                        >
                            Buy a CHROMEY Membership
                        </button>
                        ) : (
                            <p className='text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200'>
                                {"Sorry, we're all out of CHROMEY memberships :("}
                            </p>
                        ))
                    }
                </div>
            )}

            {user && (
                <button
                onClick={logout}
                className='bg-white/90 text-sky-600 py-2 px-8 border-2 border-sky-600 rounded-md hover:bg-sky-600/90 hover:text-white hover:border-white mt-10 uppercase font-bold transition duration-200'
                >
                    Logout
                </button>
            )}
        </main>
        <p className='absolute bottom-5 left-5 font-serif text-white cursor-default italic text-xs font-semibold'>
            CHROMEY NFT Owner - Gio
        </p>
        <video muted autoPlay loop src='/background.mp4' className='fixed -z-10 min-h-full min-w-full object-fill' />
    </div>
  )
}

export default Login