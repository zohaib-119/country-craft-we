'use client'

import { useSession, signIn, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Nav = () => {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();

            setProviders(response);
        }

        setUpProviders();
    }, [])
  

    return (
        <header className="w-full flex justify-between items-center px-6 py-4 bg-white border-b">
            <h1 className="text-2xl font-bold text-orange-500">
                <Link href="/">CountryCraft</Link>
            </h1>
            <nav className="flex items-center space-x-4 text-lg">
                <Link href="/" className="text-gray-700 font-medium hover:text-orange-500">
                    Home
                </Link>
                <Link
                    href="/products"
                    className="text-gray-700 font-medium hover:text-orange-500"
                >
                    Products
                </Link>
                {session ? (
                    <div className="flex gap-3 items-center">
                        <Image
                            src={session.user.image}
                            width={37}
                            height={37}
                            alt="profile"
                            className="rounded-full object-contain cursor-pointer"
                            onClick={() => router.push('/profile')}
                        />
                        <FaShoppingCart className="text-gray-700 text-2xl cursor-pointer hover:text-orange-500" onClick={()=> router.replace('/cart')} />
                    </div>
                ) : (
                    <>
                        {
                            providers && Object.values(providers).map((provider) => (
                                <button
                                    type="button" key={provider.name} onClick={() => signIn(provider.id)} className="border rounded-full py-2 px-4 bg-orange-500 text-lg text-white"
                                >
                                    Sign In
                                    {/* Sign In */}
                                </button>
                            ))
                        }
                    </>


                )}
            </nav>
        </header>
    );
};

export default Nav;
