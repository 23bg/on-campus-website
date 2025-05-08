"use client";

import { motion } from "framer-motion";
import { MoveRight, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/public/download (1).gif";
import Link from "next/link";

export const Hero5 = () => {
  

    return (
        <section className="relative h-screen w-full overflow-hidden  bg-black/20 ">
            {/* Background GIF */}
            <Image
                src={logo}
                alt="Logo"
                fill
                priority
                className="absolute top-0 left-0 object-cover w-full h-full z-[-1] m-0 blur-md rounded-3xl"
            />

            {/* Hero Content */}
            <div className="w-full h-full flex items-center-safe justify-center px-6">
                <div className="container mx-auto flex flex-col items-center text-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Button variant="ghost" size="sm" className="gap-2 text-white">
                            <Bug className="w-4 h-4" />
                            Bugs & Glitches
                        </Button>
                    </motion.div>

                    <div className="flex gap-5 flex-col text-white">
                        <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                            <span className="text-spektr-cyan-50">
                                <b className="text-white text-shadow-black ">On Campus</b>
                            </span>
                            
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center text-white">
                            Imrabo isn&lsquo;t just an AI. It&lsquo;s a thinking, evolving assistant that
                            helps you work smarter, automate tasks, and stay ahead.
                        </p>
                    </div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link href="https://app.imrabo.com/log-in" target="_blank">
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 bg-transparent text-white hover:text-blue-500 hover:bg-white hover:border-0 hover:gap-5 ease-in-out shadow-2xl"
                            >
                                Get Started <MoveRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                
                </div>
            </div>
        </section>
    );
};
